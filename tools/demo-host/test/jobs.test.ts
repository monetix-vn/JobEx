// @vitest-environment jsdom
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { mount, mountRolePicker } from '@je/client-web';
import type { CoreEventPayloads } from '@je/contracts';
import type { Run } from '@je/kernel';
import { QC_ROLE, SALES_ROLE, createGameHost, listPlayableRoles } from '../src/host';

const contentRoot = join(import.meta.dirname, '..', '..', '..', 'content');
function readFiles(): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (dir: string, prefix: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      if (statSync(full).isDirectory()) walk(full, rel);
      else files[rel] = readFileSync(full, 'utf8');
    }
  };
  walk(contentRoot, '');
  return files;
}

afterEach(() => {
  document.body.replaceChildren();
  document.head.replaceChildren();
});

const scenesOf = (run: Run) =>
  run
    .exportLog()
    .entries.filter((e) => e.type === 'scene.started')
    .map((e) => (e.payload as CoreEventPayloads['scene.started']).sceneId);

describe('choosing a job', () => {
  it('lists the playable jobs with their text in the chosen language', async () => {
    const en = await listPlayableRoles(readFiles(), 'en');
    const vi = await listPlayableRoles(readFiles(), 'vi');
    expect(en.map((r) => r.id)).toEqual([QC_ROLE, SALES_ROLE]);
    expect(en.map((r) => r.title)).toEqual([
      'Quality Control Specialist',
      'Export Sales Specialist',
    ]);
    expect(vi.map((r) => r.title)).toEqual([
      'Chuyên viên Kiểm soát Chất lượng',
      'Chuyên viên Kinh doanh Xuất khẩu',
    ]);
    for (const role of [...en, ...vi]) expect(role.blurb.length).toBeGreaterThan(40);
    // The manager role has no blurb, so it cannot be picked.
    expect(en.some((r) => r.id === 'role.qc.manager')).toBe(false);
  });

  it('the picker shows one card per job, sends the pick, and lets the player change language', async () => {
    const roles = await listPlayableRoles(readFiles(), 'en');
    const picked: string[] = [];
    const langs: string[] = [];
    const root = document.createElement('div');
    document.body.append(root);
    mountRolePicker(root, roles, {
      locale: 'en',
      onPick: (id) => picked.push(id),
      onLocaleChange: (l) => langs.push(l),
    });
    expect(root.textContent).toContain('Choose your job');
    expect([...root.querySelectorAll('.je-job b')].map((b) => b.textContent)).toEqual(
      roles.map((r) => r.title),
    );
    (root.querySelector(`[data-role="${QC_ROLE}"]`) as HTMLButtonElement).click();
    expect(picked).toEqual([QC_ROLE]);
    (root.querySelector('[data-lang="vi"]') as HTMLButtonElement).click();
    expect(langs).toEqual(['vi']);
  });

  it('the picker can be shown in Vietnamese and cleans up after itself', async () => {
    const roles = await listPlayableRoles(readFiles(), 'vi');
    const root = document.createElement('div');
    document.body.append(root);
    const picker = mountRolePicker(root, roles, { locale: 'vi', onPick: () => undefined });
    expect(root.textContent).toContain('Chọn công việc của bạn');
    expect(document.head.querySelectorAll('style')).toHaveLength(1);
    picker.dispose();
    expect(root.childElementCount).toBe(0);
    expect(document.head.querySelectorAll('style')).toHaveLength(0);
  });
});

describe('playing the QC job through the client', () => {
  it('a person plays QC scenes only (plus shared ones) and the stats respond', async () => {
    const { run, transport } = await createGameHost({
      files: readFiles(),
      seed: 'qc-human',
      roleId: QC_ROLE,
    });
    const root = document.createElement('div');
    document.body.append(root);
    mount(root, transport);

    let decisions = 0;
    for (let week = 0; week < 15; week++) {
      run.advanceTurn();
      for (let guard = 0; guard < 6; guard++) {
        const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-choice]')].filter(
          (b) => !b.disabled,
        );
        if (buttons.length === 0) break;
        buttons[0]!.click();
        decisions += 1;
      }
    }
    expect(decisions).toBeGreaterThan(10);
    const scenes = scenesOf(run).filter((id) => !id.startsWith('notice.'));
    expect(
      scenes.every(
        (id) =>
          id.startsWith('scene.qc.') ||
          id === 'scene.buyer_audit_notice' ||
          id === 'scene.audit_day',
      ),
    ).toBe(true);
    expect(scenes.some((id) => id.startsWith('scene.qc.'))).toBe(true);
    expect(root.querySelector('.je-stats')?.textContent).toMatch(/Stress \d+/);
  });

  it('the job is part of the recorded run, so language switching keeps it', async () => {
    const host = await createGameHost({ files: readFiles(), seed: 'qc-keep', roleId: QC_ROLE });
    host.run.advanceTurn();
    const state = host.run.snapshot()['sim-core'] as Record<string, unknown>;
    expect(state['player.role']).toBe(QC_ROLE);
  });

  it('refuses an unknown job', async () => {
    await expect(
      createGameHost({ files: readFiles(), seed: 'x', roleId: 'role.nope' }),
    ).rejects.toThrow(/unknown role/);
  });
});
