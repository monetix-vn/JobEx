# Review pack: IT Support and Systems Administrator

AI first draft. Please read as someone who has done this job. For each scene mark: realistic? (is the
pressure believable), tone (grey, not cartoonish), Vietnamese natural (not a translation). Write notes
under each scene. Names and places are invented.

28 scenes. Facts created are listed under each outcome.

## buyer_audit_notice

*random; tags: buyer, audit, pressure*

- **Boss:** The buyer just sent an audit notice. They will inspect the plant in about a month.
  - *VI* **Sếp:** Khách hàng vừa gửi thông báo đánh giá. Khoảng một tháng nữa họ sẽ đến kiểm tra nhà máy.
- **QC lead:** Our batch records have gaps. Someone has to reconcile them before the audit.
  - *VI* **Trưởng QC:** Hồ sơ lô hàng của mình còn thiếu. Phải có người đối chiếu lại trước ngày đánh giá.

**c1.** Volunteer to rebuild the records from the source documents, honestly.  
*VI:* Xung phong dựng lại hồ sơ từ chứng từ gốc, làm trung thực.

- (60%) It takes six long hours, but the records hold together and QC notices.
  - *VI:* Mất sáu tiếng vất vả, nhưng hồ sơ khớp và phòng QC ghi nhận.
  - effects: rep.qc +5, fact records_prepared_honestly (witnessed)
- (40%, goes badly) You find more gaps than expected and lose the evening to them.
  - *VI:* Bạn phát hiện nhiều chỗ thiếu hơn dự tính và mất cả buổi tối cho việc này.
  - effects: stress +8

**c2.** Say nothing and hope the auditors do not look closely.  
*VI:* Im lặng và hy vọng đoàn đánh giá không soi kỹ.

- (100%) The meeting moves on. The gaps are still there.
  - *VI:* Cuộc họp chuyển sang việc khác. Những chỗ thiếu vẫn còn đó.
  - effects: company.audit_readiness -5

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## audit_day

*comes from a storyline; tags: buyer, audit*

- **QC lead:** The auditors are on the floor. Keep your answers short and accurate.
  - *VI* **Trưởng QC:** Đoàn đánh giá đang ở xưởng. Trả lời ngắn gọn và chính xác.

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.first_week

*beat, weeks 1-3; tags: onboarding, people, beat*

- **Mr Kien:** Welcome to IT. We are two people and an intern for four hundred staff, one ERP and a server room that is also a cupboard. Tickets first, projects when there are no tickets, which is never. One rule: nobody gets access to anything without a ticket, an approver and a date. It sounds slow. It is what saves us in an audit.
  - *VI* **Anh Kiên:** Chào mừng em đến IT. Mình có hai người và một thực tập sinh cho bốn trăm nhân viên, một ERP và một phòng máy chủ đồng thời là cái tủ. Phiếu hỗ trợ trước, dự án khi hết phiếu, mà không bao giờ hết. Một quy tắc: không ai được cấp quyền truy cập gì nếu không có phiếu, người duyệt và ngày tháng. Nghe chậm. Nhưng đó là điều cứu mình khi bị kiểm toán.
- **Bin:** I have the admin password for the server saved in my browser, if you need it. Everyone in IT has it. It has been the same since the system was installed.
  - *VI* **Bin:** Em có mật khẩu quản trị máy chủ lưu trong trình duyệt, nếu anh/chị cần. Ai trong IT cũng có. Nó không đổi từ khi cài hệ thống.

**c1.** Spend the first days making an inventory: who has admin, who has ERP access, which accounts belong to people who left, and what backups really exist. Write it down.  
*VI:* Dành những ngày đầu lập bản kê: ai có quyền quản trị, ai có quyền ERP, tài khoản nào thuộc về người đã nghỉ và thực sự có những bản sao lưu nào. Ghi lại.

- (100%) Eleven people have admin rights, four accounts belong to people who left last year, and the last backup that anyone has tested restored in March. Kien reads your list and says: 'Good. Now we know what we do not know.' The password is changed by Friday.
  - *VI:* Mười một người có quyền quản trị, bốn tài khoản thuộc về người đã nghỉ năm ngoái và bản sao lưu cuối cùng có người thử khôi phục là hồi tháng Ba. Anh Kiên đọc danh sách và nói: 'Tốt. Giờ mình biết điều mình chưa biết.' Mật khẩu được đổi trước thứ Sáu.
  - effects: rel.kien.trust +5, rel.bin.trust +2, rep.boss +2, stress +1

**c2.** Start on the open tickets, and look at accounts and backups when there is a quiet week.  
*VI:* Bắt đầu với các phiếu đang mở và xem tài khoản và sao lưu khi có một tuần yên.

- (100%) You close thirty tickets in the first fortnight. Nobody tells you that the one about the printer is on the machine that has the shared admin password.
  - *VI:* Anh/chị đóng ba mươi phiếu trong hai tuần đầu. Không ai nói với anh/chị rằng phiếu về máy in nằm trên chiếc máy có mật khẩu quản trị dùng chung.
  - effects: rel.kien.trust +1, stress +1

**c3.** Use the shared admin password as everyone does, since it is faster and you have tickets to close.  
*VI:* Dùng mật khẩu quản trị dùng chung như mọi người vì nhanh hơn và anh/chị có phiếu cần đóng.

- (70%) The tickets close fast. The server log shows every action as 'admin', with no name beside it.
  - *VI:* Các phiếu đóng nhanh. Nhật ký máy chủ ghi mọi hành động là 'admin', không có tên bên cạnh.
  - effects: rel.kien.trust -1, rel.bin.trust +1, stress +1
- (30%, goes badly) A file goes missing from the finance share. The log says 'admin', and four people could have done it. Kien asks, mildly, who was in the server that morning.
  - *VI:* Một tệp biến mất khỏi thư mục dùng chung của tài chính. Nhật ký ghi 'admin' và bốn người có thể đã làm. Anh Kiên hỏi, nhẹ nhàng, sáng đó ai vào máy chủ.
  - effects: rel.kien.trust -4, rep.finance -2, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.midyear_review

*beat, weeks 24-28; tags: people, review, beat*

- **Mr Kien:** Half a year. Your ticket resolution time is slower than the target, but there have been no repeat incidents and the access list is the cleanest it has ever been. The directors only look at resolution time. How do you want to handle that?
  - *VI* **Anh Kiên:** Nửa năm rồi. Thời gian xử lý phiếu của em chậm hơn chỉ tiêu, nhưng không có sự cố lặp lại và danh sách quyền truy cập sạch nhất từ trước đến nay. Ban giám đốc chỉ nhìn thời gian xử lý. Em muốn xử lý chuyện đó thế nào?

**c1.** Show the full picture: tickets, repeat incidents, accounts reviewed and risks closed, and propose that repeat incidents, not raw speed, are the measure.  
*VI:* Cho xem bức tranh đầy đủ: phiếu, sự cố lặp lại, tài khoản đã rà soát và rủi ro đã đóng, và đề xuất lấy sự cố lặp lại, không phải tốc độ thô, làm thước đo.

- (70%) Kien takes the page to Mr Cuong. 'Repeat incidents' is added to the review next to resolution time. A small change, and it changes what IT is rewarded for.
  - *VI:* Anh Kiên mang trang giấy lên anh Cường. 'Sự cố lặp lại' được thêm vào đánh giá cạnh thời gian xử lý. Một thay đổi nhỏ, và nó đổi điều IT được thưởng.
  - effects: rel.kien.trust +4, rep.boss +3, stress +1
- (30%, goes badly) Mr Cuong says that nobody notices IT unless something is broken. Kien shrugs: 'I tried.' Your resolution time stays modest.
  - *VI:* Anh Cường nói không ai để ý IT trừ khi có gì hỏng. Anh Kiên nhún vai: 'Anh đã thử.' Thời gian xử lý của em vẫn khiêm tốn.
  - effects: rel.kien.trust +2, stress +2

**c2.** Say you will clear the older tickets with a focused fortnight, and ask Kien to hold new project requests for two weeks.  
*VI:* Nói anh/chị sẽ dọn các phiếu cũ trong hai tuần tập trung và xin anh Kiên giữ các yêu cầu dự án mới hai tuần.

- (100%) Kien agrees, and writes the rule next to the request. You clear the backlog and the resolution time improves, and a project slips a fortnight.
  - *VI:* Anh Kiên đồng ý và ghi quy tắc bên cạnh yêu cầu. Anh/chị dọn hết các phiếu tồn và thời gian xử lý cải thiện, và một dự án trễ hai tuần.
  - effects: rel.kien.trust +2, stress +2

**c3.** Say you will hit the resolution target whatever it takes.  
*VI:* Nói anh/chị sẽ đạt chỉ tiêu xử lý bằng mọi giá.

- (60%) Kien smiles. 'Good attitude.' A week later you notice that the quickest way to close a ticket is to close it, and to reopen it as a new one if the user complains.
  - *VI:* Anh Kiên cười. 'Thái độ tốt.' Một tuần sau anh/chị nhận ra cách nhanh nhất để đóng phiếu là đóng nó và mở lại thành phiếu mới nếu người dùng phàn nàn.
  - effects: rel.kien.trust +3, stress +3
- (40%, goes badly) Bin notices that your closed tickets are being reopened, and says so in the team meeting, innocently. Kien looks at the chart for a long moment.
  - *VI:* Bin nhận ra các phiếu anh/chị đóng đang bị mở lại và nói vô tư trong cuộc họp nhóm. Anh Kiên nhìn biểu đồ một lúc lâu.
  - effects: rel.kien.trust -3, rel.bin.trust +1, rep.boss -2, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.phishing_click

*beat, weeks 29-32; tags: security, incident, beat*

- **Thu:** I clicked on an email that said it was from the bank, and a document opened and asked me to enable macros. I enabled them. Then the screen flickered. It is the day before the month-end close, and I need the finance share. I am so sorry.
  - *VI* **Thu:** Em bấm vào một email nói là của ngân hàng, một tài liệu mở ra và yêu cầu bật macro. Em đã bật. Rồi màn hình nháy. Mai là ngày trước chốt tháng và em cần thư mục tài chính. Em xin lỗi lắm.
- **Bin:** I can see three machines talking to an address I do not know. Should I just turn them off?
  - *VI* **Bin:** Em thấy ba máy đang nói chuyện với một địa chỉ em không biết. Em tắt chúng luôn nhé?

**c1.** Isolate the three machines from the network, preserve the logs, call Kien, and tell Duc that the finance share may be affected before the close.  
*VI:* Cách ly ba máy khỏi mạng, giữ nhật ký, gọi anh Kiên và báo anh Đức thư mục tài chính có thể bị ảnh hưởng trước kỳ chốt.

- (70%) Two machines are infected, and the share is intact. You find the malware before it spreads, and the logs show where it started. Kien says: 'This is what an incident should look like.' Thu cries a little and is thanked.
  - *VI:* Hai máy bị nhiễm và thư mục dùng chung còn nguyên. Anh/chị tìm ra mã độc trước khi nó lan và nhật ký cho thấy nó bắt đầu từ đâu. Anh Kiên nói: 'Một sự cố phải trông như thế này.' Thư khóc một chút và được cảm ơn.
  - effects: rel.kien.trust +4, rel.thu.trust +3, rel.duc.trust +1, rep.finance +2, stress +5, fact reported_incident_promptly (witnessed), arc the_ransom: lock
- (30%, goes badly) The malware has already encrypted part of the finance share. You have isolated the rest, and the logs are intact. It is a bad night, and it is a night with a record.
  - *VI:* Mã độc đã mã hóa một phần thư mục tài chính. Anh/chị đã cách ly phần còn lại và nhật ký còn nguyên. Một đêm tồi tệ, và là đêm có hồ sơ.
  - effects: rel.kien.trust +3, rel.thu.trust +3, rel.duc.trust -2, rep.finance -1, stress +7, fact reported_incident_promptly (witnessed), arc the_ransom: lock

**c2.** Tell Bin to turn the machines off, scan the rest of the network, and keep it between IT until you know what happened.  
*VI:* Bảo Bin tắt các máy, quét phần còn lại của mạng và giữ giữa IT cho đến khi biết chuyện gì xảy ra.

- (100%) The machines go dark, and so do the volatile logs. You scan through the night. By morning you have a clean network and an incomplete story.
  - *VI:* Các máy tắt, và nhật ký tạm thời cũng mất. Anh/chị quét suốt đêm. Đến sáng có một mạng sạch và một câu chuyện không đầy đủ.
  - effects: rel.kien.trust +1, rel.thu.trust +1, stress +5, arc the_ransom: lock

**c3.** Reassure Thu it is probably nothing, tell Bin to scan quietly, and avoid worrying Duc before the close.  
*VI:* Trấn an Thư là chắc không sao, bảo Bin quét lặng lẽ và tránh làm anh Đức lo trước kỳ chốt.

- (70%) The scan finds nothing obvious. Overnight, the malware sits and waits. At six in the morning, the finance share starts to encrypt itself.
  - *VI:* Quét không thấy gì rõ ràng. Qua đêm, mã độc nằm chờ. Sáu giờ sáng, thư mục tài chính bắt đầu tự mã hóa.
  - effects: rel.kien.trust -3, rel.thu.trust -1, rel.duc.trust -1, stress +2, fact delayed_incident_report (private), arc the_ransom: lock
- (30%, goes badly) By midnight, the encryption spreads to the file server, the backup share and the ERP export folder. Duc phones at one in the morning, and asks why nobody told him at four.
  - *VI:* Đến nửa đêm, mã hóa lan sang máy chủ tệp, thư mục sao lưu và thư mục xuất của ERP. Anh Đức gọi lúc một giờ sáng và hỏi vì sao bốn giờ chiều không ai báo.
  - effects: rel.kien.trust -6, rel.thu.trust -2, rel.duc.trust -8, rep.boss -5, rep.finance -6, stress +8, fact delayed_incident_report (witnessed), arc the_ransom: lock

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.security_review

*beat, weeks 41-44; tags: audit, security, beat*

- **Mr Quoc:** I am the internal auditor for IT general controls. I would like to see the list of people with administrator rights, the ERP user list with their roles, the leaver process, the backup test records and the incident log for the year. I start with the access list, not with the firewall.
  - *VI* **Anh Quốc:** Tôi là kiểm toán nội bộ cho kiểm soát chung về IT. Tôi muốn xem danh sách người có quyền quản trị, danh sách người dùng ERP kèm vai trò, quy trình người nghỉ việc, hồ sơ kiểm thử sao lưu và nhật ký sự cố cả năm. Tôi bắt đầu từ danh sách quyền truy cập, không phải tường lửa.
- **Mr Kien:** Give him what he asks for. Do not explain more than you are asked, and do not guess.
  - *VI* **Anh Kiên:** Đưa ông ấy những gì ông ấy yêu cầu. Đừng giải thích nhiều hơn điều được hỏi và đừng đoán.

**c1.** Give him the real lists: who has what, the leavers whose accounts were late to close, the backup tests and the incident log, with what you fixed and what remains open.  
*VI:* Đưa ông các danh sách thật: ai có gì, những người nghỉ việc có tài khoản đóng muộn, các lần kiểm thử sao lưu và nhật ký sự cố, kèm điều đã sửa và điều còn mở.

- (100%) Quoc reads for three hours and writes five observations. None is serious. 'An access list that matches the people. I wish that were less unusual.' Kien nods at you across the room.
  - *VI:* Anh Quốc đọc ba giờ và ghi năm nhận xét. Không cái nào nghiêm trọng. 'Một danh sách quyền khớp với con người. Tôi ước điều đó bớt hiếm.' Anh Kiên gật đầu với anh/chị từ phía bên kia phòng.
  - effects: rel.quoc.trust +5, rel.kien.trust +4, rep.finance +2, rep.boss +3, stress +2

**c2.** Answer his questions and give him the lists he asks for, without volunteering anything.  
*VI:* Trả lời câu hỏi và đưa các danh sách ông yêu cầu, không chủ động nói thêm gì.

- (100%) A routine review. Quoc notes two items, both already on Kien's list. You come out with nothing to hide and no credit either.
  - *VI:* Một buổi rà soát thường lệ. Anh Quốc ghi hai mục, cả hai đã có trong danh sách của anh Kiên. Anh/chị ra về không có gì phải giấu và cũng không được tiếng khen.
  - effects: rel.quoc.trust +1, rel.kien.trust +1

**c3.** Tidy the access list before the review: remove the leaver accounts and the shared logins, and back-date the removal tickets so that the history looks clean.  
*VI:* Dọn danh sách quyền trước buổi rà soát: xóa tài khoản người nghỉ việc và đăng nhập dùng chung và ghi lùi ngày các phiếu xóa để lịch sử trông sạch.

- (45%) Quoc sees a clean list. He asks why the removal tickets for eleven accounts were all created on the same day, and accepts the explanation.
  - *VI:* Anh Quốc thấy một danh sách sạch. Anh hỏi vì sao phiếu xóa của mười một tài khoản đều được tạo cùng một ngày và chấp nhận lời giải thích.
  - effects: rel.quoc.trust -2, rel.kien.trust -5, stress -1, fact backdated_access_tickets (private)
- (55%, goes badly) The directory log records the real deletion times, and the ticket system records the real creation times. Quoc places the two exports side by side and says nothing for a long time.
  - *VI:* Nhật ký thư mục ghi giờ xóa thật, và hệ thống phiếu ghi giờ tạo thật. Anh Quốc đặt hai bản xuất cạnh nhau và im lặng rất lâu.
  - effects: rel.quoc.trust -10, rel.kien.trust -8, rep.boss -6, rep.finance -4, stress +6, fact backdated_access_tickets (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.year_end_review

*beat, weeks 49-50; tags: people, review, beat*

- **Mr Kien:** Annual review. Before I give you my view, tell me how you would rate your own year, and what you would handle differently on access and incidents.
  - *VI* **Anh Kiên:** Đánh giá cuối năm. Trước khi anh cho ý kiến, em hãy tự chấm năm của mình và nói em sẽ xử lý khác đi điều gì về quyền truy cập và sự cố.

**c1.** Give an honest account, including the shortcuts you took on access, the incident you reported late, and what it would have cost to say no earlier.  
*VI:* Kể thật lòng, kể cả các lối tắt em đã đi về quyền truy cập, sự cố em báo muộn và cái giá của việc nói không sớm hơn.

- (100%) Kien is quiet for a long moment. He writes: 'Tells us what the logs will tell us, first.' It is the best thing you have read about yourself.
  - *VI:* Anh Kiên im lặng một lúc lâu. Anh viết: 'Nói cho mình điều nhật ký sẽ nói, trước tiên.' Đó là lời hay nhất anh/chị từng đọc về mình.
  - effects: rel.kien.trust +5, rep.boss +4, stress -2

**c2.** Stay modest: list the wins and one thing to improve.  
*VI:* Khiêm tốn: nêu các thắng lợi và một điều cần cải thiện.

- (100%) A safe review. Kien nods and moves to the next topic.
  - *VI:* Một buổi đánh giá an toàn. Anh Kiên gật đầu và chuyển chủ đề.
  - effects: rel.kien.trust +1, rep.boss +1

**c3.** Present the year as a success and leave out the access you granted without a ticket and the incident that nearly got away.  
*VI:* Trình bày cả năm như một thành công và bỏ qua quyền truy cập cấp không có phiếu và sự cố suýt vuột.

- (65%) It lands well. You leave with a good rating and a small weight in your chest.
  - *VI:* Được đón nhận tốt. Anh/chị ra về với điểm cao và một chút nặng nề trong lòng.
  - effects: rel.kien.trust +2, rep.boss +4, stress +1, fact polished_it_review (private)
- (35%, goes badly) Kien has the directory audit log open on his desk, with the dates. He turns the screen towards you without a word.
  - *VI:* Anh Kiên có nhật ký kiểm toán thư mục mở sẵn trên bàn, kèm ngày tháng. Anh xoay màn hình về phía anh/chị mà không nói một lời.
  - effects: rel.kien.trust -8, rep.boss -5, stress +4, fact polished_it_review (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.manager_offer

*beat, weeks 51-52; tags: people, promotion, beat*

- **Mr Kien:** I am moving to group IT at the end of the year. Mr Cuong asked me who should run IT here. I named you. One condition: every month, a director will ask you to give someone access, or look at something, that the policy does not allow. I need to know what you will say.
  - *VI* **Anh Kiên:** Cuối năm anh chuyển sang IT tập đoàn. Anh Cường hỏi anh ai nên điều hành IT ở đây. Anh nêu tên em. Một điều kiện: mỗi tháng sẽ có giám đốc nhờ em cấp quyền cho ai đó, hoặc xem một thứ mà chính sách không cho phép. Anh cần biết em sẽ nói gì.

**c1.** Accept, and say plainly which requests you will not grant, and that the directors will hear it from you first, in writing.  
*VI:* Nhận lời và nói rõ những yêu cầu anh/chị sẽ không đáp ứng và ban giám đốc sẽ nghe điều đó từ anh/chị trước, bằng văn bản.

- (100%) Kien smiles. 'Then it is yours. Put the list on the first page of the access policy.' You take over IT with the limits in writing.
  - *VI:* Anh Kiên cười. 'Vậy là của em. Đưa danh sách đó lên trang đầu chính sách truy cập.' Anh/chị tiếp quản IT với các giới hạn đã viết ra giấy.
  - effects: rel.kien.trust +5, rep.boss +5, ENDING promoted

**c2.** Thank him, but decline: you prefer running systems to defending them to the directors.  
*VI:* Cảm ơn anh nhưng từ chối: anh/chị muốn vận hành hệ thống hơn là bảo vệ chúng trước ban giám đốc.

- (100%) Kien looks disappointed, then understanding. 'The next manager may not be as careful as you.'
  - *VI:* Anh Kiên có vẻ thất vọng rồi thông cảm. 'Người quản lý tiếp theo có thể không cẩn thận như em.'
  - effects: rel.kien.trust +2, stress -3

**c3.** Accept without asking what the condition means in practice.  
*VI:* Nhận lời mà không hỏi điều kiện đó thực tế nghĩa là gì.

- (100%) Kien nods slowly and Mr Cuong congratulates you a little too warmly. You realise you agreed to something you did not ask about.
  - *VI:* Anh Kiên gật đầu chậm và anh Cường chúc mừng anh/chị hơi quá nồng nhiệt. Anh/chị nhận ra mình đã đồng ý với điều mình không hỏi.
  - effects: rep.boss +4, fact accepted_it_condition (private), ENDING promoted

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.resignation_thought

*random; tags: people, pressure*

- **Bin:** You look like you have not slept. With respect: I have seen sysadmins carry the pager for two years, and leave by the summer. Are you all right?
  - *VI* **Bin:** Anh/chị trông như chưa ngủ. Xin phép nói thẳng: em từng thấy quản trị viên mang máy nhắn hai năm và nghỉ vào mùa hè. Anh/chị ổn không?

**c1.** Talk to Kien about the on-call load, and ask him to share the pager with you for a month.  
*VI:* Nói với anh Kiên về gánh nặng trực và xin anh chia máy nhắn với anh/chị một tháng.

- (80%) Kien listens, takes alternate weekends, and says he should have noticed sooner.
  - *VI:* Anh Kiên lắng nghe, nhận luân phiên các cuối tuần và nói lẽ ra anh phải để ý sớm hơn.
  - effects: rel.kien.trust +4, rel.bin.trust +2, stress -6, rep.boss +1
- (20%, goes badly) Kien nods and says everyone is stretched at year end. You leave with sympathy and the same pager.
  - *VI:* Anh Kiên gật đầu và nói cuối năm ai cũng căng. Anh/chị ra về với sự cảm thông và chiếc máy nhắn cũ.
  - effects: rel.kien.trust +1, stress -1

**c2.** Hand in your resignation, politely, with the notice the contract requires.  
*VI:* Nộp đơn xin nghỉ, lịch sự, báo trước đúng như hợp đồng quy định.

- (100%) Kien reads it twice and does not argue. You hand over a password vault and an up-to-date access list, and walk out lighter than you walked in.
  - *VI:* Anh Kiên đọc hai lần và không phản đối. Anh/chị bàn giao một kho mật khẩu và danh sách quyền cập nhật và bước ra nhẹ nhõm hơn lúc bước vào.
  - effects: rel.kien.trust +2, ENDING walked_away

**c3.** Tell Bin you are fine and keep going.  
*VI:* Nói với Bin là anh/chị ổn và tiếp tục.

- (100%) Bin nods and does not push. You feel slightly worse afterwards for having said it.
  - *VI:* Bin gật đầu và không gặng hỏi. Sau đó anh/chị thấy hơi tệ hơn vì đã nói vậy.
  - effects: rel.bin.trust -1, stress +2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.read_their_mail

*random; tags: privacy, surveillance, dark*

- **Mr Cuong:** Somebody is passing our price quotes to a rival. I want to read the mailboxes of the export sales team, starting with Vinh and Ngoc. Do not tell HR, do not tell Legal, and do not make a ticket. I am the General Director. Just give yourself access and tell me what you see.
  - *VI* **Anh Cường:** Có người đang chuyển báo giá của mình cho đối thủ. Anh muốn đọc hộp thư của nhóm kinh doanh xuất khẩu, bắt đầu từ Vinh và Ngọc. Đừng nói với nhân sự, đừng nói với pháp chế và đừng lập phiếu. Anh là Tổng Giám đốc. Cứ tự cấp quyền và nói anh nghe em thấy gì.

**c1.** Decline to open anyone's mailbox without written authorisation from HR and Legal, and propose a targeted check of the leaked documents' access logs instead.  
*VI:* Từ chối mở hộp thư của bất kỳ ai khi không có văn bản ủy quyền của nhân sự và pháp chế và đề xuất kiểm tra có mục tiêu nhật ký truy cập của các tài liệu bị rò rỉ.

- (70%) Mr Cuong is angry for ten minutes and then asks Oanh for the authorisation. The log check shows that the quotes were downloaded by one account, from a home address. It is not Ngoc.
  - *VI:* Anh Cường giận mười phút rồi nhờ chị Oanh ký ủy quyền. Kiểm tra nhật ký cho thấy các báo giá được tải về bởi một tài khoản, từ địa chỉ nhà. Không phải Ngọc.
  - effects: rel.cuong.trust -3, rel.kien.trust +4, rel.oanh.trust +3, rep.boss -1, stress +4, fact refused_unauthorised_access (witnessed), arc the_email: end
- (30%, goes badly) Mr Cuong says that he will find somebody who is less careful. Kien backs you in writing, and you do not know whether that will be enough.
  - *VI:* Anh Cường nói anh sẽ tìm người ít cẩn thận hơn. Anh Kiên ủng hộ anh/chị bằng văn bản, và anh/chị không biết điều đó có đủ không.
  - effects: rel.cuong.trust -5, rel.kien.trust +4, rep.boss -3, stress +6, fact refused_unauthorised_access (witnessed), arc the_email: end

**c2.** Offer to search the mailboxes for the specific leaked documents only, with a written request from Mr Cuong and a copy to Kien and Oanh.  
*VI:* Đề nghị tìm trong hộp thư chỉ các tài liệu bị rò rỉ cụ thể, với yêu cầu bằng văn bản của anh Cường và bản sao gửi anh Kiên và chị Oanh.

- (100%) Mr Cuong sends a one-line request and copies the other two. The search finds the documents in one mailbox only. You report that, and nothing else you saw.
  - *VI:* Anh Cường gửi yêu cầu một dòng và đồng gửi hai người kia. Tìm kiếm thấy tài liệu trong một hộp thư. Anh/chị báo điều đó, và không gì khác anh/chị thấy.
  - effects: rel.cuong.trust +1, rel.kien.trust +2, stress +3, arc the_email: found

**c3.** Give yourself access to the mailboxes as asked, and say nothing to anyone.  
*VI:* Tự cấp quyền truy cập các hộp thư như được yêu cầu và không nói với ai.

- (70%) The access is silent. You read Vinh's mail and Ngoc's. Mr Cuong thanks you with a smile.
  - *VI:* Việc truy cập âm thầm. Anh/chị đọc thư của anh Vinh và của Ngọc. Anh Cường cảm ơn bằng một nụ cười.
  - effects: rel.cuong.trust +5, rel.kien.trust -3, stress +1, fact read_mailbox_without_authorisation (private), arc the_email: found
- (30%, goes badly) The mail server logs every mailbox access with the account used. Kien finds yours in the weekly review, and asks you, gently, who authorised it.
  - *VI:* Máy chủ thư ghi mọi lần truy cập hộp thư kèm tài khoản dùng. Anh Kiên thấy của anh/chị trong buổi rà soát tuần và hỏi, nhẹ nhàng, ai đã cho phép.
  - effects: rel.cuong.trust +3, rel.kien.trust -7, rep.boss -4, stress +5, fact read_mailbox_without_authorisation (witnessed), arc the_email: found

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.what_you_found

*comes from a storyline; tags: privacy, surveillance, dark, arc*

- **Mr Cuong:** So? What did you see? Anything about the quotes, of course. And anything else that is interesting. I am told that Ngoc has been talking to a lawyer, and that someone in the team is looking for a new job. I would like to know who.
  - *VI* **Anh Cường:** Sao? Em thấy gì? Tất nhiên là bất cứ điều gì về báo giá. Và bất cứ điều gì thú vị khác. Anh nghe nói Ngọc đã nói chuyện với luật sư và có người trong nhóm đang tìm việc mới. Anh muốn biết là ai.

**c1.** Report only what concerns the quotes, say that the rest is personal and not yours to share, and offer to escalate anything else to HR and Legal.  
*VI:* Chỉ báo điều liên quan đến báo giá, nói phần còn lại là chuyện cá nhân và không phải của anh/chị để chia sẻ và đề nghị chuyển bất cứ điều gì khác cho nhân sự và pháp chế.

- (80%) Mr Cuong stares at you. 'You saw it and you will not say.' You say that is correct. He lets it go, and does not forget it.
  - *VI:* Anh Cường nhìn chằm chằm anh/chị. 'Em thấy rồi và em không nói.' Anh/chị nói đúng vậy. Anh bỏ qua, và không quên.
  - effects: rel.cuong.trust -4, rel.kien.trust +3, rel.ngoc.trust +4, rep.boss -2, rep.staff +4, stress +4, fact protected_personal_findings (witnessed), arc the_email: gossip
- (20%, goes badly) Mr Cuong tells you to put it in writing, and then asks Kien to confirm that you are blocking him. Kien says that you are following the policy.
  - *VI:* Anh Cường bảo anh/chị viết ra giấy rồi nhờ anh Kiên xác nhận anh/chị đang cản trở anh. Anh Kiên nói anh/chị đang tuân thủ chính sách.
  - effects: rel.cuong.trust -6, rel.kien.trust +4, rel.ngoc.trust +3, rep.boss -4, rep.staff +3, stress +6, fact protected_personal_findings (witnessed), arc the_email: gossip

**c2.** Say that you saw a message from Ngoc to a lawyer's office, but no details, and that you will not read any more without authorisation.  
*VI:* Nói anh/chị thấy một tin nhắn của Ngọc gửi văn phòng luật nhưng không có chi tiết và sẽ không đọc thêm nếu không được phép.

- (100%) Mr Cuong nods slowly. 'A lawyer.' He does not say what he plans to do. You regret the sentence as soon as you have said it.
  - *VI:* Anh Cường gật đầu chậm. 'Luật sư.' Anh không nói định làm gì. Anh/chị hối hận về câu nói ngay khi vừa nói xong.
  - effects: rel.cuong.trust +1, rel.ngoc.trust -4, rep.staff -2, stress +4, arc the_email: gossip

**c3.** Tell Mr Cuong everything you saw: the lawyer, the job application and the medical appointment.  
*VI:* Nói với anh Cường mọi điều anh/chị thấy: luật sư, đơn xin việc và lịch hẹn khám bệnh.

- (70%) Mr Cuong says 'Very useful.' By the end of the week, Ngoc is moved off the buyer account and told that it is a 'workload adjustment'.
  - *VI:* Anh Cường nói 'Rất hữu ích.' Cuối tuần, Ngọc bị chuyển khỏi tài khoản khách và được báo đó là 'điều chỉnh khối lượng công việc'.
  - effects: rel.cuong.trust +5, rel.ngoc.trust -10, rel.kien.trust -4, rep.staff -6, stress +3, fact shared_personal_findings (private), arc the_email: gossip
- (30%, goes badly) Ngoc learns that her messages were read when her lawyer's name is mentioned in a meeting where it should not have been. She writes to the labour authority that evening.
  - *VI:* Ngọc biết thư của chị đã bị đọc khi tên luật sư của chị được nhắc trong cuộc họp mà không nên có. Tối đó chị viết thư cho cơ quan lao động.
  - effects: rel.cuong.trust +2, rel.ngoc.trust -14, rel.kien.trust -6, rel.oanh.trust -4, rep.boss -8, rep.staff -10, stress +8, fact shared_personal_findings (public), arc the_email: gossip

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.the_gossip

*comes from a storyline; tags: privacy, consequence, arc*

- **Ms Oanh:** Two things have reached me. A manager mentioned a private conversation between an employee and a lawyer, and a candidate's job application elsewhere. Neither of those is information that HR or the managers have given out. The only people who could have seen those are in IT. I need to ask you directly.
  - *VI* **Chị Oanh:** Hai việc đã đến tai chị. Một quản lý nhắc đến cuộc trao đổi riêng giữa một nhân viên và luật sư, và đơn xin việc ở nơi khác của một ứng viên. Cả hai đều không phải thông tin nhân sự hay các quản lý đã đưa ra. Chỉ những người ở IT mới có thể thấy chúng. Chị cần hỏi thẳng em.

**c1.** Tell Oanh exactly what happened: who asked, what you were told to do, what you saw and what you shared. Give her the logs.  
*VI:* Nói với chị Oanh chính xác chuyện đã xảy ra: ai nhờ, anh/chị được bảo làm gì, thấy gì và đã chia sẻ gì. Đưa chị các nhật ký.

- (100%) Oanh reads the logs and nods. 'Thank you for telling me, and not letting me find out.' An incident is opened. The mailboxes are closed to everyone, and you get a formal note.
  - *VI:* Chị Oanh đọc nhật ký và gật đầu. 'Cảm ơn em đã nói, và không để chị tự tìm ra.' Một sự cố được mở. Các hộp thư được khóa với mọi người, và anh/chị nhận một ghi chú chính thức.
  - effects: rel.oanh.trust +3, rel.kien.trust +2, rel.ngoc.trust +3, rep.boss -3, rep.staff +3, stress +5, arc the_email: end

**c2.** Say that you followed a director's instruction, and give no more detail.  
*VI:* Nói anh/chị làm theo chỉ đạo của một giám đốc và không nêu chi tiết hơn.

- (50%) Oanh waits for more. When there is none, she writes 'IT followed a director's instruction' in the file, and the director's name is a question mark.
  - *VI:* Chị Oanh chờ thêm. Khi không có, chị ghi 'IT làm theo chỉ đạo của một giám đốc' vào hồ sơ, và tên giám đốc là một dấu hỏi.
  - effects: rel.oanh.trust -3, rel.cuong.trust +1, stress +4, arc the_email: end
- (50%, goes badly) The mail log has your account on both mailboxes, with the date. Oanh puts it on the table without speaking.
  - *VI:* Nhật ký thư có tài khoản của anh/chị trên cả hai hộp thư kèm ngày. Chị Oanh đặt nó lên bàn mà không nói.
  - effects: rel.oanh.trust -8, rel.kien.trust -5, rep.boss -6, rep.staff -6, stress +6, arc the_email: end

**c3.** Say that you saw nothing, and suggest the managers must have heard it elsewhere.  
*VI:* Nói anh/chị không thấy gì và gợi ý các quản lý chắc nghe ở nơi khác.

- (40%) Oanh looks at you for a long moment, and writes it down. The matter stays open.
  - *VI:* Chị Oanh nhìn anh/chị một lúc lâu và ghi lại. Vụ việc vẫn còn mở.
  - effects: rel.oanh.trust -5, stress +4, fact lied_about_mailbox_access (private), arc the_email: end
- (60%, goes badly) The mail server's audit log shows your account opening both mailboxes at eleven at night. Oanh asks Kien to confirm the log, and he does, without looking at you.
  - *VI:* Nhật ký kiểm toán của máy chủ thư cho thấy tài khoản của anh/chị mở cả hai hộp thư lúc mười một giờ đêm. Chị Oanh nhờ anh Kiên xác nhận nhật ký, và anh xác nhận, không nhìn anh/chị.
  - effects: rel.oanh.trust -10, rel.kien.trust -9, rel.ngoc.trust -4, rep.boss -10, rep.staff -8, stress +8, fact lied_about_mailbox_access (public), arc the_email: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.shared_login

*random; tags: access, passwords, dark*

- **Ms Hanh:** Thu is on leave for two weeks and I cannot get into the payment module without her. Could you just give me her login? It is faster than a ticket, and she would not mind. We share the shared drive password anyway.
  - *VI* **Chị Hạnh:** Thư nghỉ phép hai tuần và chị không vào được mô-đun thanh toán nếu thiếu cô ấy. Em cứ đưa chị tài khoản của cô ấy được không? Nhanh hơn làm phiếu, và cô ấy sẽ không phiền. Dù sao mình cũng dùng chung mật khẩu thư mục.

**c1.** Raise a ticket for temporary delegated access in Hanh's own name, approved by Duc, with an end date, so that every action has her name on it.  
*VI:* Lập phiếu cấp quyền ủy quyền tạm thời mang tên chính chị Hạnh, do anh Đức duyệt, có ngày kết thúc, để mọi hành động đều có tên chị.

- (85%) The ticket takes forty minutes and an email from Duc. Hanh says it is quicker than she expected and slower than she wanted. Every payment that fortnight is in her name.
  - *VI:* Phiếu mất bốn mươi phút và một email của anh Đức. Chị Hạnh nói nhanh hơn chị nghĩ và chậm hơn chị muốn. Mọi khoản thanh toán tuần đó đều mang tên chị.
  - effects: rel.hanh.trust +2, rel.duc.trust +2, rel.kien.trust +3, rep.finance +2, stress +2, fact kept_least_privilege (witnessed), arc the_keys: rights
- (15%, goes badly) Duc is on a plane and cannot approve. The payment run is delayed by a day, and Hanh is not pleased. She does not ask again.
  - *VI:* Anh Đức đang trên máy bay và không duyệt được. Đợt thanh toán trễ một ngày, và chị Hạnh không hài lòng. Chị không hỏi lại.
  - effects: rel.hanh.trust -2, rel.kien.trust +2, stress +3, arc the_keys: rights

**c2.** Reset Thu's password to a temporary one, give it to Hanh, and ask Thu to change it when she returns.  
*VI:* Đặt lại mật khẩu của Thư thành mật khẩu tạm, đưa cho chị Hạnh và nhờ Thư đổi khi quay lại.

- (100%) It works. Every payment for two weeks is recorded as Thu's, while she is on a beach. Hanh does not think about it. You do.
  - *VI:* Chạy được. Mọi khoản thanh toán trong hai tuần được ghi là của Thư, trong lúc cô đang ở bãi biển. Chị Hạnh không nghĩ đến chuyện đó. Anh/chị thì có.
  - effects: rel.hanh.trust +3, rel.kien.trust -1, stress +1, arc the_keys: rights

**c3.** Give Hanh Thu's login and password, and tell her to use them whenever she needs.  
*VI:* Đưa chị Hạnh tài khoản và mật khẩu của Thư và bảo chị cứ dùng khi cần.

- (70%) Hanh thanks you warmly, and shares the password with her assistant the next day. The payment module now has three people using one login.
  - *VI:* Chị Hạnh cảm ơn nồng nhiệt và chia sẻ mật khẩu với trợ lý hôm sau. Mô-đun thanh toán giờ có ba người dùng một tài khoản.
  - effects: rel.hanh.trust +5, rel.kien.trust -3, stress +1, fact shared_admin_login (private), arc the_keys: rights
- (30%, goes badly) A payment of forty million goes out under Thu's name on a day when she is abroad. The bank queries it, and Duc asks the first person he sees in IT.
  - *VI:* Một khoản thanh toán bốn mươi triệu được chuyển dưới tên Thư vào ngày cô đang ở nước ngoài. Ngân hàng hỏi, và anh Đức hỏi người đầu tiên anh gặp ở IT.
  - effects: rel.hanh.trust +2, rel.kien.trust -7, rel.duc.trust -5, rep.boss -4, rep.finance -5, stress +6, fact shared_admin_login (witnessed), arc the_keys: rights

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.erp_rights

*comes from a storyline; tags: access, erp, dark, arc*

- **Mr Duc:** Thu is the only one who can approve supplier invoices, and she is also the only one who can release payments. It is slow, because she has to do both. Give her both rights permanently, and the process will be faster. She is trusted. It is only a formality.
  - *VI* **Anh Đức:** Thư là người duy nhất duyệt hóa đơn nhà cung cấp, và cũng là người duy nhất phát lệnh thanh toán. Chậm, vì cô phải làm cả hai. Cấp cho cô cả hai quyền vĩnh viễn thì quy trình sẽ nhanh hơn. Cô được tin cậy. Chỉ là hình thức.

**c1.** Explain segregation of duties, keep approval and payment with different people, and propose a faster workflow: batch approvals and an alert for aged invoices.  
*VI:* Giải thích phân tách nhiệm vụ, giữ duyệt và thanh toán ở hai người khác nhau và đề xuất quy trình nhanh hơn: duyệt theo lô và cảnh báo hóa đơn tồn.

- (70%) Duc listens, then grumbles. 'So it is not about trust.' You say it is about nobody having to be trusted. The batch approval cuts the delay by half, and Thu can finally take a holiday.
  - *VI:* Anh Đức lắng nghe rồi càu nhàu. 'Vậy không phải về lòng tin.' Anh/chị nói đó là để không ai phải được tin. Duyệt theo lô cắt độ trễ một nửa, và Thư cuối cùng cũng nghỉ phép được.
  - effects: rel.duc.trust -1, rel.thu.trust +3, rel.kien.trust +3, rep.finance +3, stress +3, fact fixed_access_properly (witnessed), arc the_keys: leaver
- (30%, goes badly) Duc says that he will take the risk himself and asks you to document it. You write the request down, and ask Kien to sign. Kien refuses to sign it, and the rights are not granted.
  - *VI:* Anh Đức nói anh sẽ tự nhận rủi ro và nhờ anh/chị ghi lại. Anh/chị ghi yêu cầu và nhờ anh Kiên ký. Anh Kiên từ chối ký, và các quyền không được cấp.
  - effects: rel.duc.trust -3, rel.thu.trust +2, rel.kien.trust +4, rep.finance +2, stress +5, fact fixed_access_properly (witnessed), arc the_keys: leaver

**c2.** Give Thu both rights but add a daily report of every invoice she approves and pays, sent to Hanh.  
*VI:* Cấp cho Thư cả hai quyền nhưng thêm báo cáo hằng ngày về mọi hóa đơn cô duyệt và thanh toán gửi chị Hạnh.

- (100%) The report is read for two weeks and then archived unread. It is a compensating control, and a weak one.
  - *VI:* Báo cáo được đọc hai tuần rồi được lưu mà không ai đọc. Đó là kiểm soát bù, và là kiểm soát yếu.
  - effects: rel.duc.trust +1, rel.thu.trust +1, stress +2, arc the_keys: leaver

**c3.** Give Thu both rights permanently, with no further control.  
*VI:* Cấp cho Thư cả hai quyền vĩnh viễn, không thêm kiểm soát.

- (70%) The invoices fly through. Duc is delighted. Thu now approves and pays her own entries, and has been told that it is all right.
  - *VI:* Các hóa đơn qua rất nhanh. Anh Đức rất vui. Thư giờ duyệt và thanh toán chính các bút toán của mình, và được bảo là không sao.
  - effects: rel.duc.trust +5, rel.thu.trust -2, rel.kien.trust -4, rep.finance +2, stress +1, fact granted_conflicting_erp_rights (private), arc the_keys: leaver
- (30%, goes badly) Quoc's quarterly access test flags a user who can both approve and pay. He finds your ticket, and asks Kien for the risk acceptance. There is none.
  - *VI:* Phép kiểm tra quyền truy cập hằng quý của anh Quốc đánh dấu một người dùng vừa duyệt vừa thanh toán được. Anh tìm thấy phiếu của anh/chị và xin anh Kiên chấp nhận rủi ro. Không có.
  - effects: rel.duc.trust +2, rel.thu.trust -4, rel.kien.trust -8, rel.quoc.trust -6, rep.boss -5, rep.finance -6, stress +6, fact granted_conflicting_erp_rights (witnessed), arc the_keys: leaver

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.leaver_account

*comes from a storyline; tags: access, leaver, dark, arc*

- **Mr Long:** Do you remember the salesman who left last spring? His account is still active, is it not? I have a few files in his folder that I need for the family office. Could you just give me his login for a week? It is a dead account. Nobody will notice.
  - *VI* **Anh Long:** Em nhớ nhân viên kinh doanh nghỉ hồi mùa xuân không? Tài khoản của cậu ấy vẫn đang hoạt động, đúng không? Anh có vài tệp trong thư mục của cậu ấy cần cho văn phòng gia đình. Em đưa anh tài khoản đó một tuần được không? Tài khoản chết rồi. Không ai để ý.

**c1.** Disable the leaver account today as the process requires, copy the files Long needs to a new folder in his own name after Duc confirms they are company files, and add the account to the leaver report.  
*VI:* Vô hiệu hóa tài khoản người đã nghỉ hôm nay như quy trình yêu cầu, sao chép các tệp anh Long cần vào một thư mục mới mang tên anh sau khi anh Đức xác nhận đó là tệp của công ty và thêm tài khoản vào báo cáo người nghỉ việc.

- (80%) Long grumbles, and gets the files in a new folder by lunchtime. The leaver report shows four closed accounts that month. Kien says nothing, and approves.
  - *VI:* Anh Long càu nhàu và có các tệp trong thư mục mới trước trưa. Báo cáo người nghỉ việc cho thấy bốn tài khoản được đóng tháng đó. Anh Kiên không nói gì và duyệt.
  - effects: rel.long.trust -3, rel.kien.trust +3, rel.duc.trust +2, rep.finance +2, stress +2, arc the_keys: end
- (20%, goes badly) Long says that you are treating the owner's family like a stranger. He does not push the point. A cold week follows, and the folder is clean.
  - *VI:* Anh Long nói anh/chị đối xử với gia đình chủ sở hữu như người lạ. Anh không nhấn mạnh. Một tuần lạnh nhạt theo sau, và thư mục sạch.
  - effects: rel.long.trust -6, rel.kien.trust +3, stress +4, arc the_keys: end

**c2.** Copy the files to Long without using the account, and disable the account when you are next on the leaver list.  
*VI:* Sao chép các tệp cho anh Long mà không dùng tài khoản đó và vô hiệu hóa tài khoản khi đến lượt trong danh sách người nghỉ việc.

- (100%) Long has the files. The leaver account stays active for another six weeks, and nobody uses it.
  - *VI:* Anh Long có các tệp. Tài khoản người đã nghỉ vẫn hoạt động thêm sáu tuần, và không ai dùng nó.
  - effects: rel.long.trust +1, rel.kien.trust -1, stress +2, arc the_keys: end

**c3.** Give Long the leaver's login, and leave the account active as it is.  
*VI:* Đưa anh Long tài khoản của người đã nghỉ và để nguyên tài khoản đang hoạt động.

- (70%) Long uses it for a week, and again in the autumn. It has the salesman's permissions, which include the price list. The account is active for another year.
  - *VI:* Anh Long dùng một tuần, và lại dùng vào mùa thu. Nó có quyền của nhân viên kinh doanh, gồm cả bảng giá. Tài khoản hoạt động thêm một năm.
  - effects: rel.long.trust +5, rel.kien.trust -3, stress +1, fact left_leaver_account_active (private), arc the_keys: end
- (30%, goes badly) The old account logs in from a home address, then downloads the full price list. Kien finds the pattern in the weekly log and asks you who knows the password.
  - *VI:* Tài khoản cũ đăng nhập từ địa chỉ nhà, rồi tải toàn bộ bảng giá. Anh Kiên thấy mẫu hình trong nhật ký tuần và hỏi anh/chị ai biết mật khẩu.
  - effects: rel.long.trust +2, rel.kien.trust -8, rep.boss -5, rep.finance -3, stress +6, fact left_leaver_account_active (witnessed), arc the_keys: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.files_locked

*comes from a storyline; tags: security, incident, dark, arc*

- **Mr Duc:** It is the morning of the close. The finance share, and part of the ERP exports, show a note on every folder: pay in cryptocurrency within seventy-two hours, or the data is gone and goes public. I have the board on Friday and the bank on Monday. Tell me what you know, and tell me what we can do.
  - *VI* **Anh Đức:** Sáng nay là ngày chốt. Thư mục tài chính và một phần các bản xuất ERP hiện một ghi chú trên mọi thư mục: trả bằng tiền mã hóa trong bảy mươi hai giờ nếu không dữ liệu mất và bị công khai. Thứ Sáu anh họp hội đồng và thứ Hai làm việc với ngân hàng. Nói anh nghe em biết gì và mình làm được gì.

**c1.** Tell Duc plainly what you know and do not know, that you are isolating the network and preserving evidence, and ask for Kien, Quoc and Legal to be in the room within the hour.  
*VI:* Nói rõ với anh Đức điều anh/chị biết và không biết, rằng anh/chị đang cách ly mạng và giữ bằng chứng, và đề nghị anh Kiên, anh Quốc và pháp chế có mặt trong vòng một giờ.

- (100%) Duc is pale, and the room fills in forty minutes. For the first time that year nobody asks you to make the number work. A plan appears on the whiteboard, and your name is under 'evidence'.
  - *VI:* Anh Đức tái mặt, và phòng đầy người sau bốn mươi phút. Lần đầu năm đó không ai bảo anh/chị làm cho con số chạy. Một kế hoạch hiện trên bảng trắng, và tên anh/chị nằm dưới 'bằng chứng'.
  - effects: rel.duc.trust +2, rel.kien.trust +3, rel.quoc.trust +2, rep.finance +2, stress +5, arc the_ransom: decision

**c2.** Tell Duc you can restore from last night's backup, and ask for a few hours before bringing anyone else in.  
*VI:* Nói với anh Đức anh/chị khôi phục được từ bản sao lưu đêm qua và xin vài giờ trước khi gọi ai khác vào.

- (100%) Duc says yes with relief. You start the restore. It is slower than you hoped, and nobody else knows yet.
  - *VI:* Anh Đức đồng ý với vẻ nhẹ nhõm. Anh/chị bắt đầu khôi phục. Chậm hơn anh/chị hy vọng, và chưa ai khác biết.
  - effects: rel.duc.trust +1, rel.kien.trust -2, stress +5, arc the_ransom: decision

**c3.** Tell Duc that it is under control, and ask him not to mention it to anyone until it is solved.  
*VI:* Nói với anh Đức mọi việc trong tầm kiểm soát và xin anh đừng nhắc với ai cho đến khi giải quyết xong.

- (70%) Duc agrees, because he wants to. You have a locked share, a note and a plan that is in your head only.
  - *VI:* Anh Đức đồng ý vì anh muốn vậy. Anh/chị có thư mục bị khóa, một ghi chú và một kế hoạch chỉ có trong đầu.
  - effects: rel.duc.trust +4, rel.kien.trust -4, stress +3, fact hid_security_incident (private), arc the_ransom: decision
- (30%, goes badly) Kien sees the ransom note on a user's screen in the corridor, and walks into the room without knocking. He says: 'Why am I learning this from a monitor?'
  - *VI:* Anh Kiên thấy ghi chú đòi tiền trên màn hình của một người dùng ở hành lang và bước vào phòng không gõ cửa. Anh nói: 'Sao anh phải biết chuyện này từ một màn hình?'
  - effects: rel.duc.trust +2, rel.kien.trust -9, rep.boss -5, stress +6, fact hid_security_incident (witnessed), arc the_ransom: decision

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.pay_or_restore

*comes from a storyline; tags: security, ransom, dark, arc*

- **Mr Kien:** The facts. The backup from last Friday is clean and covers ninety percent of what was encrypted. The restore will take three days, and the close will slip. The attackers say that they will give the key for four million dong in cryptocurrency. There is no guarantee they will, and the money funds the next attack. Duc wants to pay. What is your recommendation?
  - *VI* **Anh Kiên:** Sự thật. Bản sao lưu thứ Sáu tuần trước sạch và bao phủ chín mươi phần trăm dữ liệu bị mã hóa. Khôi phục mất ba ngày, và kỳ chốt sẽ trễ. Kẻ tấn công nói họ sẽ đưa khóa nếu nhận bốn triệu đồng bằng tiền mã hóa. Không có gì bảo đảm họ sẽ đưa, và số tiền tài trợ cho đợt tấn công tiếp theo. Anh Đức muốn trả. Khuyến nghị của em là gì?

**c1.** Recommend restoring from backup, rebuilding the infected machines, rotating every password and not paying, and tell the directors the close will be late and why.  
*VI:* Khuyến nghị khôi phục từ bản sao lưu, dựng lại các máy bị nhiễm, đổi mọi mật khẩu và không trả tiền, và nói với ban giám đốc kỳ chốt sẽ trễ và vì sao.

- (70%) The restore takes three and a half days, and the close slips by four. Duc is miserable, and the data returns, clean. Kien writes the report, and your name is under 'recommended'.
  - *VI:* Khôi phục mất ba ngày rưỡi, và kỳ chốt trễ bốn ngày. Anh Đức rất khổ sở, và dữ liệu trở lại, sạch. Anh Kiên viết báo cáo, và tên anh/chị nằm dưới 'khuyến nghị'.
  - effects: rel.duc.trust -1, rel.kien.trust +5, rel.hanh.trust +2, rep.boss +3, rep.finance +1, stress +6, fact restored_from_backup (witnessed), arc the_ransom: disclosure
- (30%, goes badly) One of the backups is corrupt, and a week of invoices must be re-entered by hand. Hanh and Thu work two weekends, and nobody says 'I told you so'.
  - *VI:* Một bản sao lưu bị hỏng, và một tuần hóa đơn phải nhập lại bằng tay. Chị Hạnh và Thư làm hai cuối tuần, và không ai nói 'đã bảo mà'.
  - effects: rel.duc.trust -2, rel.kien.trust +4, rel.hanh.trust -1, rep.boss +1, stress +8, fact restored_from_backup (witnessed), arc the_ransom: disclosure

**c2.** Recommend restoring, and ask the directors whether they want to consult the police and a specialist before deciding anything about payment.  
*VI:* Khuyến nghị khôi phục và hỏi ban giám đốc có muốn tham vấn cảnh sát và một chuyên gia trước khi quyết định về việc trả tiền không.

- (100%) A specialist advises against paying, in writing. The restore goes ahead, and the decision is documented. It is slower than anyone wanted, and it is on the record.
  - *VI:* Một chuyên gia khuyên không trả, bằng văn bản. Việc khôi phục tiến hành, và quyết định được ghi lại. Chậm hơn mọi người muốn, và có hồ sơ.
  - effects: rel.duc.trust +1, rel.kien.trust +2, stress +5, arc the_ransom: disclosure

**c3.** Help Duc pay the ransom quietly through an account that does not go through the ledger.  
*VI:* Giúp anh Đức trả tiền chuộc lặng lẽ qua một tài khoản không đi qua sổ cái.

- (60%) The payment is made. A key arrives, and works for most of the files. The attackers know the company pays, and the company's ledger does not.
  - *VI:* Khoản thanh toán được thực hiện. Một khóa đến và mở được phần lớn tệp. Kẻ tấn công biết công ty trả tiền, còn sổ cái của công ty thì không.
  - effects: rel.duc.trust +6, rel.kien.trust -6, stress +2, fact paid_ransom_secretly (private), arc the_ransom: disclosure
- (40%, goes badly) The key works for half the files. The attackers send a second demand with a sample of the data. Duc asks you, very quietly, what to do next.
  - *VI:* Khóa mở được nửa số tệp. Kẻ tấn công gửi yêu cầu thứ hai kèm một mẫu dữ liệu. Anh Đức hỏi anh/chị, rất khẽ, mình làm gì tiếp.
  - effects: rel.duc.trust +4, rel.kien.trust -8, rep.boss -5, rep.finance -5, stress +8, fact paid_ransom_secretly (witnessed), arc the_ransom: disclosure

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.tell_the_customers

*comes from a storyline; tags: security, disclosure, consequence, arc*

- **Mr Quoc:** The forensic review is complete. The attackers had access to the finance share for nine days before they encrypted it. It included buyers' bank details, supplier contracts and some employee payroll data. We may be obliged to tell the buyers and the data protection authority. I would like to know what you recommend, and what the logs say.
  - *VI* **Anh Quốc:** Cuộc rà soát pháp y đã xong. Kẻ tấn công truy cập thư mục tài chính chín ngày trước khi mã hóa. Nó gồm thông tin ngân hàng của khách, hợp đồng nhà cung cấp và một số dữ liệu lương nhân viên. Có thể mình có nghĩa vụ báo cho khách và cơ quan bảo vệ dữ liệu. Anh muốn biết khuyến nghị của em và nhật ký nói gì.

**c1.** Recommend telling the buyers, the authority and the employees promptly, with the facts, what you are doing about it, and what they should watch for. Give Quoc the logs.  
*VI:* Khuyến nghị báo cho khách, cơ quan và nhân viên kịp thời, kèm sự thật, điều anh/chị đang làm và điều họ nên theo dõi. Đưa anh Quốc các nhật ký.

- (80%) The notices go out within the legal window. Anders writes back: 'Thank you for telling us before we read it elsewhere.' Several buyers ask for an audit, and none leaves.
  - *VI:* Các thông báo được gửi trong thời hạn luật định. Ông Anders viết lại: 'Cảm ơn đã báo trước khi chúng tôi đọc ở nơi khác.' Vài khách xin kiểm toán, và không ai rời đi.
  - effects: rel.quoc.trust +4, rel.kien.trust +3, rel.duc.trust -1, rep.boss +2, rep.buyer +3, rep.staff +3, stress +6, fact disclosed_breach (witnessed), arc the_ransom: end
- (20%, goes badly) One buyer, upset about the delay in the business that follows, takes a third of its order elsewhere. The disclosure was correct, and the cost is real.
  - *VI:* Một khách, bực vì sự chậm trễ trong công việc sau đó, chuyển một phần ba đơn hàng đi nơi khác. Việc công bố là đúng, và cái giá là thật.
  - effects: rel.quoc.trust +4, rel.kien.trust +3, rep.boss +1, rep.buyer -2, rep.staff +3, stress +7, fact disclosed_breach (witnessed), arc the_ransom: end

**c2.** Recommend notifying only the authority, in the minimum form, and not the buyers unless they ask.  
*VI:* Khuyến nghị chỉ báo cơ quan, ở dạng tối thiểu, và không báo khách trừ khi họ hỏi.

- (60%) The authority acknowledges the notice, and the buyers hear nothing. Quoc writes down the recommendation as yours, and the date.
  - *VI:* Cơ quan xác nhận đã nhận thông báo, và khách không nghe gì. Anh Quốc ghi khuyến nghị là của anh/chị, kèm ngày.
  - effects: rel.quoc.trust -2, rel.kien.trust -1, stress +4, arc the_ransom: end
- (40%, goes badly) A buyer's bank calls about unusual activity on an account, and the buyer asks whether the company has had a security incident. Anders asks Duc, and Duc asks you.
  - *VI:* Ngân hàng của một khách gọi về hoạt động bất thường trên tài khoản, và khách hỏi công ty có xảy ra sự cố an ninh không. Ông Anders hỏi anh Đức, và anh Đức hỏi anh/chị.
  - effects: rel.quoc.trust -4, rel.kien.trust -3, rel.duc.trust -3, rep.boss -5, rep.buyer -6, stress +6, arc the_ransom: end

**c3.** Recommend telling nobody, and delete the logs that show the nine days.  
*VI:* Khuyến nghị không báo ai và xóa các nhật ký cho thấy chín ngày đó.

- (40%) The logs are deleted. Duc is relieved, and nobody outside the room knows. The nine days are a gap in the record, and a gap is an answer.
  - *VI:* Các nhật ký bị xóa. Anh Đức nhẹ nhõm, và không ai ngoài phòng biết. Chín ngày là một khoảng trống trong hồ sơ, và khoảng trống là một câu trả lời.
  - effects: rel.quoc.trust -8, rel.duc.trust +5, rel.kien.trust -6, stress +2, fact deleted_security_logs (private), arc the_ransom: end
- (60%, goes badly) The mail gateway, the firewall and the cloud provider each keep their own copy of the logs. Quoc has all three on the table by the afternoon.
  - *VI:* Cổng thư, tường lửa và nhà cung cấp đám mây đều giữ bản sao nhật ký của riêng mình. Đến chiều anh Quốc có cả ba trên bàn.
  - effects: rel.quoc.trust -12, rel.duc.trust +1, rel.kien.trust -10, rep.boss -12, rep.buyer -8, rep.finance -6, stress +9, fact deleted_security_logs (public), arc the_ransom: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.boss_password

*random; tags: passwords, executives, dark*

- **Mr Cuong:** I keep forgetting my password. Set it to something simple I can remember, like the company name and the year, and give a copy to my assistant so that she can read my mail when I travel. And turn off that second step thing. It is a waste of my time.
  - *VI* **Anh Cường:** Anh cứ quên mật khẩu. Đặt cho anh cái gì đơn giản dễ nhớ, như tên công ty và năm, và đưa một bản cho trợ lý để cô ấy đọc thư giúp khi anh đi công tác. Và tắt cái bước thứ hai đó đi. Phí thời gian của anh.

**c1.** Set up a password manager for Mr Cuong, enable delegated mailbox access for his assistant in her own name, and keep two-step sign-in with a quick app prompt.  
*VI:* Cài trình quản lý mật khẩu cho anh Cường, bật quyền ủy quyền hộp thư cho trợ lý mang tên cô và giữ đăng nhập hai bước với thông báo nhanh trên ứng dụng.

- (70%) Mr Cuong grumbles for two days, then says 'Fine, it is easy.' His assistant has her own access, and the log shows who reads what. Kien nods across the room.
  - *VI:* Anh Cường càu nhàu hai ngày rồi nói 'Được, dễ thôi.' Trợ lý có quyền riêng, và nhật ký cho thấy ai đọc gì. Anh Kiên gật đầu từ phía bên kia phòng.
  - effects: rel.cuong.trust -1, rel.kien.trust +3, rep.boss +2, stress +2
- (30%, goes badly) Mr Cuong says the new set-up is too complicated and goes back to a paper note under his keyboard. You find it on the third day, and photograph it for the register.
  - *VI:* Anh Cường nói cách mới quá phức tạp và quay lại mảnh giấy dưới bàn phím. Ngày thứ ba anh/chị thấy nó và chụp ảnh cho sổ đăng ký.
  - effects: rel.cuong.trust -3, rel.kien.trust +2, stress +3

**c2.** Set a longer password that he can remember as a phrase, and leave two-step sign-in on.  
*VI:* Đặt mật khẩu dài hơn mà anh nhớ được như một câu và giữ đăng nhập hai bước.

- (100%) It is a good compromise. Mr Cuong stops complaining after a week, and complains about something else.
  - *VI:* Đó là thỏa hiệp tốt. Anh Cường thôi phàn nàn sau một tuần, và phàn nàn chuyện khác.
  - effects: rel.cuong.trust +1, stress +1

**c3.** Set a simple password, share it with the assistant, and turn off two-step sign-in, as asked.  
*VI:* Đặt mật khẩu đơn giản, chia sẻ với trợ lý và tắt đăng nhập hai bước như được yêu cầu.

- (70%) Mr Cuong is delighted. Three weeks later, his account sends two hundred phishing emails to the buyers' list.
  - *VI:* Anh Cường rất vui. Ba tuần sau, tài khoản của anh gửi hai trăm email lừa đảo đến danh sách khách.
  - effects: rel.cuong.trust +4, rel.kien.trust -3, stress +2, fact shared_boss_password (private)
- (30%, goes badly) The account is hijacked in the first week, and a fake invoice with Mr Cuong's name goes to Anders. Duc catches it a day later. Kien asks who set the password.
  - *VI:* Tài khoản bị chiếm trong tuần đầu, và một hóa đơn giả mang tên anh Cường gửi đến ông Anders. Một ngày sau anh Đức phát hiện. Anh Kiên hỏi ai đặt mật khẩu.
  - effects: rel.cuong.trust +2, rel.kien.trust -8, rel.duc.trust -3, rep.boss -6, rep.buyer -4, stress +7, fact shared_boss_password (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.pirated_software

*random; tags: licences, audit, dark*

- **Ms Yen:** I am carrying out a software licence check on behalf of two vendors. I would like to see the install list for the design and engineering machines, and your purchase records. I notice that some of the machines run a drawing package that appears to be cracked.
  - *VI* **Chị Yến:** Tôi tiến hành kiểm tra bản quyền phần mềm thay mặt hai nhà cung cấp. Tôi muốn xem danh sách cài đặt các máy thiết kế và kỹ thuật và hồ sơ mua sắm. Tôi thấy một số máy chạy một phần mềm vẽ có vẻ đã bị bẻ khóa.

**c1.** Show Yen the real install list and purchase records, explain the gap, and ask for time to buy licences or switch tools, with a written plan.  
*VI:* Cho chị Yến xem danh sách cài đặt thật và hồ sơ mua, giải thích khoảng thiếu và xin thời gian mua bản quyền hoặc đổi công cụ, kèm kế hoạch bằng văn bản.

- (70%) Yen agrees to a ninety-day plan and a settlement at a discount. The company buys twelve licences and moves four machines to an open-source tool. It costs, and it ends.
  - *VI:* Chị Yến đồng ý kế hoạch chín mươi ngày và một thỏa thuận giảm giá. Công ty mua mười hai bản quyền và chuyển bốn máy sang công cụ mã nguồn mở. Tốn kém, và kết thúc.
  - effects: rel.yen.trust +4, rel.kien.trust +3, rep.boss +1, stress +4
- (30%, goes badly) The settlement is larger than the budget. Mr Cuong says IT should have found this earlier. You show him the request you wrote in March for exactly this.
  - *VI:* Khoản thỏa thuận lớn hơn ngân sách. Anh Cường nói IT lẽ ra phải phát hiện sớm hơn. Anh/chị cho anh xem yêu cầu đã viết hồi tháng Ba đúng về việc này.
  - effects: rel.yen.trust +3, rel.kien.trust +3, rel.cuong.trust -2, stress +5

**c2.** Uninstall the cracked package from every machine overnight, and tell the designers to use the old version for now.  
*VI:* Gỡ bản phần mềm bị bẻ khóa khỏi mọi máy qua đêm và bảo các nhà thiết kế dùng phiên bản cũ tạm thời.

- (100%) Yen sees clean machines, and a log of the removal. She says 'That is a start', and asks for the history. The designers lose a day.
  - *VI:* Chị Yến thấy các máy sạch và nhật ký việc gỡ. Chị nói 'Đó là một khởi đầu' và xin lịch sử. Các nhà thiết kế mất một ngày.
  - effects: rel.yen.trust +1, stress +3

**c3.** Tell Yen that the machines belong to the designers and IT does not manage their software.  
*VI:* Nói với chị Yến các máy thuộc các nhà thiết kế và IT không quản lý phần mềm của họ.

- (50%) Yen writes that down, politely. Her report names the company, the machines and the department, and says that IT 'declined to verify'.
  - *VI:* Chị Yến ghi lại, lịch sự. Báo cáo của chị nêu tên công ty, các máy và bộ phận, và ghi rằng IT 'từ chối xác minh'.
  - effects: rel.yen.trust -4, rel.kien.trust -3, rep.boss -2, stress +3, fact used_pirated_software (private)
- (50%, goes badly) The vendor's lawyer sends a letter with the number of installations, the dates and a claim fifteen times the licence price. Kien reads it twice and forwards it to Mr Cuong.
  - *VI:* Luật sư của nhà cung cấp gửi thư kèm số lượng cài đặt, ngày tháng và yêu cầu bồi thường gấp mười lăm lần giá bản quyền. Anh Kiên đọc hai lần và chuyển cho anh Cường.
  - effects: rel.yen.trust -6, rel.kien.trust -6, rel.cuong.trust -3, rep.boss -6, stress +7, fact used_pirated_software (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.shadow_cloud

*random; tags: data, shadow_it, dark*

- **Mr Bao:** My team is sharing price lists and buyers' files through a personal cloud account. It is faster than your server, which is slow and keeps asking for a VPN. Please do not block it. If you do, they will simply send everything by messaging apps.
  - *VI* **Anh Bảo:** Nhóm anh chia sẻ bảng giá và hồ sơ khách qua một tài khoản đám mây cá nhân. Nhanh hơn máy chủ của em vốn chậm và cứ đòi VPN. Làm ơn đừng chặn. Nếu chặn, họ sẽ gửi hết qua ứng dụng nhắn tin.

**c1.** Offer a sanctioned cloud folder with single sign-on, move the files in a day with Bao's team, and then block the personal account.  
*VI:* Đề xuất thư mục đám mây được phê duyệt với đăng nhập một lần, chuyển tệp trong một ngày cùng nhóm anh Bảo và sau đó chặn tài khoản cá nhân.

- (70%) The new folder is as fast as the personal one, and has an audit log. Bao says, grudgingly, 'It works.' Two people keep using the old account, and you chase them politely.
  - *VI:* Thư mục mới nhanh bằng cái cá nhân và có nhật ký kiểm toán. Anh Bảo nói, miễn cưỡng, 'Chạy được.' Hai người vẫn dùng tài khoản cũ, và anh/chị nhắc họ lịch sự.
  - effects: rel.bao.trust -1, rel.kien.trust +3, rep.boss +2, stress +4
- (30%, goes badly) The migration breaks a link that the sales team relied on, and a buyer cannot open a file for a day. Bao tells everyone that the new system is a failure. You fix it, and say nothing.
  - *VI:* Việc chuyển đổi làm hỏng một liên kết nhóm bán hàng dựa vào, và một khách không mở được tệp một ngày. Anh Bảo nói với mọi người hệ thống mới thất bại. Anh/chị sửa và không nói gì.
  - effects: rel.bao.trust -4, rel.kien.trust +2, stress +5

**c2.** Allow the personal account for non-confidential files only, and put the buyers' files on the company server with a faster VPN.  
*VI:* Cho phép tài khoản cá nhân chỉ với tệp không mật và đặt hồ sơ khách trên máy chủ công ty với VPN nhanh hơn.

- (100%) A compromise that half-works. The VPN is faster, and the personal account keeps what it should not. Kien asks for a review in three months.
  - *VI:* Một thỏa hiệp chạy được một nửa. VPN nhanh hơn, và tài khoản cá nhân vẫn giữ những gì không nên giữ. Anh Kiên xin rà soát sau ba tháng.
  - effects: rel.bao.trust +1, stress +3

**c3.** Leave it alone. It is Bao's team's choice, and IT has enough to do.  
*VI:* Để yên. Đó là lựa chọn của nhóm anh Bảo, và IT đã đủ việc.

- (70%) Everyone is happy for four months. The personal account is shared with a former employee's address, and nobody notices.
  - *VI:* Ai cũng vui bốn tháng. Tài khoản cá nhân được chia sẻ với địa chỉ của một nhân viên đã nghỉ, và không ai để ý.
  - effects: rel.bao.trust +4, rel.kien.trust -2, stress +1, fact allowed_shadow_cloud (private)
- (30%, goes badly) A salesman leaves for a rival, and the personal account goes with him, along with the buyers' price list. Kien asks why the company had no copy of the audit trail.
  - *VI:* Một nhân viên kinh doanh sang đối thủ, và tài khoản cá nhân đi cùng, kèm bảng giá khách hàng. Anh Kiên hỏi vì sao công ty không có bản sao dấu vết kiểm toán.
  - effects: rel.bao.trust +2, rel.kien.trust -6, rep.boss -6, rep.buyer -4, stress +6, fact allowed_shadow_cloud (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.direct_edit

*random; tags: erp, records, dark*

- **Mr Duc:** An invoice for ninety million was posted in the wrong period. The quarter is closed, and reopening it needs three signatures and a day. You have database access. Could you just change the posting date directly in the table? Nobody would see it, and the numbers would be right.
  - *VI* **Anh Đức:** Một hóa đơn chín mươi triệu bị hạch toán sai kỳ. Quý đã đóng, và mở lại cần ba chữ ký và một ngày. Em có quyền truy cập cơ sở dữ liệu. Em sửa thẳng ngày hạch toán trong bảng được không? Không ai thấy, và các con số sẽ đúng.

**c1.** Raise a change request, get the three signatures, reopen the period under control, correct the entry through the ERP, and close it again.  
*VI:* Lập yêu cầu thay đổi, lấy ba chữ ký, mở lại kỳ có kiểm soát, sửa bút toán qua ERP và đóng lại.

- (85%) It takes a day and a half. The entry is corrected with a trail that anybody can follow. Duc says: 'You are slow, and the only person I will not need to explain.'
  - *VI:* Mất một ngày rưỡi. Bút toán được sửa với dấu vết ai cũng theo dõi được. Anh Đức nói: 'Em chậm, và là người duy nhất anh không cần giải thích.'
  - effects: rel.duc.trust +1, rel.kien.trust +3, rel.hanh.trust +2, rep.finance +3, stress +3
- (15%, goes badly) One of the three signatories is travelling, and the reopening slips to Monday. The bank pack is a day late. Duc is not amused, and the entry is clean.
  - *VI:* Một trong ba người ký đang đi công tác, và việc mở lại trễ đến thứ Hai. Bộ báo cáo cho ngân hàng trễ một ngày. Anh Đức không vui, và bút toán sạch.
  - effects: rel.duc.trust -2, rel.kien.trust +3, rep.finance +1, stress +4

**c2.** Offer a correcting journal entry in the open period, with a note explaining the original period, and no change to closed data.  
*VI:* Đề xuất bút toán điều chỉnh trong kỳ đang mở kèm ghi chú giải thích kỳ gốc và không đổi dữ liệu đã đóng.

- (100%) Hanh agrees, and posts the correction with her own note. The quarter's numbers stay as they were. The next quarter carries the fix, in full view.
  - *VI:* Chị Hạnh đồng ý và hạch toán điều chỉnh kèm ghi chú của chính chị. Số của quý vẫn như cũ. Quý sau mang bản sửa, rõ ràng.
  - effects: rel.duc.trust +1, rel.hanh.trust +2, stress +2

**c3.** Change the posting date directly in the database, and tell no one.  
*VI:* Sửa thẳng ngày hạch toán trong cơ sở dữ liệu và không nói với ai.

- (70%) It takes thirty seconds. The numbers are right, and the audit trail is not. Duc thanks you warmly. You are now the person who can change the numbers without anyone knowing.
  - *VI:* Mất ba mươi giây. Số liệu đúng, và dấu vết kiểm toán thì không. Anh Đức cảm ơn nồng nhiệt. Giờ anh/chị là người có thể đổi số liệu mà không ai biết.
  - effects: rel.duc.trust +5, rel.kien.trust -5, stress +1, fact edited_posted_records_directly (private)
- (30%, goes badly) The ERP's integrity check compares the period totals with the ledger. It reports a mismatch at the next close, and Quoc traces it to a direct database change on the day you made it.
  - *VI:* Phép kiểm tra tính toàn vẹn của ERP so tổng kỳ với sổ cái. Nó báo lệch ở kỳ chốt sau, và anh Quốc truy ra một thay đổi trực tiếp trong cơ sở dữ liệu vào đúng ngày anh/chị làm.
  - effects: rel.duc.trust +2, rel.kien.trust -8, rel.quoc.trust -8, rep.boss -6, rep.finance -8, stress +7, fact edited_posted_records_directly (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.patch_downtime

*random; tags: security, patching, dark*

- **Mr Kien:** A critical vulnerability has been announced for the server software we run. Attackers are already using it. The patch needs a two-hour restart. Lan says no downtime in peak season, and she has the shipping schedule to prove it. I need you to decide how we handle it, and I will back you.
  - *VI* **Anh Kiên:** Một lỗ hổng nghiêm trọng vừa được công bố cho phần mềm máy chủ mình dùng. Kẻ tấn công đã khai thác. Bản vá cần khởi động lại hai giờ. Chị Lan nói không có thời gian ngừng trong mùa cao điểm, và chị có lịch giao hàng để chứng minh. Anh cần em quyết định cách xử lý, và anh sẽ ủng hộ.

**c1.** Patch in a two-hour window on Saturday night with Lan's agreement, isolate the exposed service until then, and tell the directors the risk and the plan.  
*VI:* Vá trong cửa sổ hai giờ tối thứ Bảy với sự đồng ý của chị Lan, cách ly dịch vụ bị lộ cho đến lúc đó và báo ban giám đốc rủi ro và kế hoạch.

- (80%) Lan agrees to Saturday night after reading the log of attempted attacks. The patch goes in cleanly, and Monday is quiet. Nobody sees what was prevented.
  - *VI:* Chị Lan đồng ý tối thứ Bảy sau khi đọc nhật ký các nỗ lực tấn công. Bản vá được cài sạch, và thứ Hai yên ả. Không ai thấy điều đã được ngăn.
  - effects: rel.kien.trust +4, rel.lan.trust +1, rep.production +1, rep.boss +2, stress +4
- (20%, goes badly) The restart takes four hours instead of two, and a shipment is late by half a day. Lan is angry, and Kien backs you, in writing, as he promised.
  - *VI:* Khởi động lại mất bốn giờ thay vì hai, và một lô hàng trễ nửa ngày. Chị Lan giận, và anh Kiên ủng hộ anh/chị, bằng văn bản, như đã hứa.
  - effects: rel.kien.trust +4, rel.lan.trust -4, rep.production -2, stress +6

**c2.** Apply a temporary mitigation (block the vulnerable service from outside) and schedule the patch for the first quiet week.  
*VI:* Áp dụng biện pháp giảm thiểu tạm thời (chặn dịch vụ dễ tổn thương từ bên ngoài) và lên lịch vá vào tuần yên đầu tiên.

- (100%) The mitigation holds for six weeks. It is a judgement call, written down, with a date. The vulnerability is patched when the season ends.
  - *VI:* Biện pháp giảm thiểu giữ được sáu tuần. Đó là một phán đoán, được viết ra, kèm ngày. Lỗ hổng được vá khi mùa cao điểm kết thúc.
  - effects: rel.kien.trust +1, rel.lan.trust +1, stress +3

**c3.** Skip the patch until after the peak season, as Lan asks, and do not mention it in the risk register.  
*VI:* Bỏ qua bản vá cho đến sau mùa cao điểm như chị Lan yêu cầu và không ghi vào sổ rủi ro.

- (70%) The season passes without downtime. Lan sends a thank-you note. The unpatched server is probed two hundred times, and holds.
  - *VI:* Mùa cao điểm qua không ngừng. Chị Lan gửi lời cảm ơn. Máy chủ chưa vá bị dò hai trăm lần, và vẫn chịu được.
  - effects: rel.kien.trust -3, rel.lan.trust +4, rep.production +2, stress +1, fact skipped_critical_patch (private)
- (30%, goes badly) On a Sunday, the vulnerable server is compromised. The incident report shows that the patch had been available for five weeks, and that it was not in the risk register. Kien reads the line twice.
  - *VI:* Vào một Chủ nhật, máy chủ dễ tổn thương bị xâm nhập. Báo cáo sự cố cho thấy bản vá đã có năm tuần và không có trong sổ rủi ro. Anh Kiên đọc dòng đó hai lần.
  - effects: rel.kien.trust -8, rel.lan.trust +1, rep.boss -6, rep.production -3, stress +8, fact skipped_critical_patch (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.keylogger_ask

*random; tags: privacy, surveillance, dark*

- **Mr Cuong:** I have a suspicion about the head of purchasing and a supplier. I want you to install monitoring software on his laptop that records every keystroke and takes a screenshot every minute. Do not tell him, do not tell HR, and do not write it down. We have a right to know what is happening on our own laptops.
  - *VI* **Anh Cường:** Anh nghi ngờ trưởng phòng mua hàng và một nhà cung cấp. Anh muốn em cài phần mềm giám sát lên laptop của anh ấy ghi mọi phím gõ và chụp màn hình mỗi phút. Đừng nói với anh ấy, đừng nói với nhân sự và đừng ghi lại. Mình có quyền biết điều gì đang xảy ra trên laptop của chính mình.

**c1.** Decline covert monitoring, explain the legal and trust risks, and offer a lawful alternative: a documented audit of purchase approvals and supplier payments with HR and Legal informed.  
*VI:* Từ chối giám sát bí mật, giải thích rủi ro pháp lý và lòng tin và đề xuất cách thay thế hợp pháp: kiểm toán có hồ sơ các phê duyệt mua hàng và thanh toán nhà cung cấp với nhân sự và pháp chế được báo.

- (70%) Mr Cuong exhales. 'I did not think about the law.' The audit finds a discount that Tam had not disclosed, and nothing worse. It was found without recording a single keystroke.
  - *VI:* Anh Cường thở ra. 'Anh chưa nghĩ đến luật.' Cuộc kiểm toán tìm thấy một khoản chiết khấu anh Tâm chưa khai báo và không có gì tệ hơn. Nó được tìm ra mà không ghi một phím gõ nào.
  - effects: rel.cuong.trust -2, rel.kien.trust +4, rel.tam.trust -2, rep.boss +2, stress +4, fact refused_covert_surveillance (witnessed)
- (30%, goes badly) Mr Cuong says that he will buy the software himself. Kien tells you that the company's lawyers will be informed, and that you did the right thing.
  - *VI:* Anh Cường nói anh sẽ tự mua phần mềm. Anh Kiên nói với anh/chị rằng luật sư của công ty sẽ được báo và anh/chị đã làm đúng.
  - effects: rel.cuong.trust -5, rel.kien.trust +4, rep.boss -2, stress +6, fact refused_covert_surveillance (witnessed)

**c2.** Agree to log only the websites and the files he opens on the company laptop, for two weeks, with a written approval from Kien and a notice in the acceptable-use policy.  
*VI:* Đồng ý chỉ ghi các trang web và tệp anh ấy mở trên laptop công ty, trong hai tuần, với phê duyệt bằng văn bản của anh Kiên và thông báo trong chính sách sử dụng hợp lý.

- (100%) The log is narrow, documented and covered by the policy. It shows that Tam visited a supplier's site fourteen times, which was part of his job.
  - *VI:* Nhật ký hẹp, có hồ sơ và nằm trong chính sách. Nó cho thấy anh Tâm vào trang của nhà cung cấp mười bốn lần, vốn là một phần công việc của anh.
  - effects: rel.cuong.trust +1, rel.kien.trust +1, stress +3

**c3.** Install the keylogger and screenshot tool covertly, and send Mr Cuong the recordings.  
*VI:* Cài phần mềm ghi phím và chụp màn hình bí mật và gửi cho anh Cường các bản ghi.

- (70%) The recordings contain a supplier, a personal bank login and a long conversation with a doctor. Mr Cuong reads all three, and tells you that you are very useful.
  - *VI:* Các bản ghi có một nhà cung cấp, một lần đăng nhập ngân hàng cá nhân và một cuộc trò chuyện dài với bác sĩ. Anh Cường đọc cả ba và bảo anh/chị rất hữu ích.
  - effects: rel.cuong.trust +6, rel.kien.trust -6, rel.tam.trust -6, rep.staff -6, stress +2, fact installed_keylogger (private)
- (30%, goes badly) Tam finds the tool during a routine update. He takes the screen to Oanh and to a lawyer on the same afternoon, and the first line he says is the name of the person who installed it.
  - *VI:* Anh Tâm thấy công cụ trong một lần cập nhật định kỳ. Anh mang màn hình đến chị Oanh và một luật sư ngay chiều đó, và câu đầu tiên anh nói là tên người đã cài.
  - effects: rel.cuong.trust +2, rel.kien.trust -10, rel.tam.trust -12, rel.oanh.trust -6, rep.boss -10, rep.staff -10, stress +9, fact installed_keylogger (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.vendor_gift

*random; tags: vendor, gifts, dark*

- **Mr Son:** Our cloud backup service is exactly what you need, and we can start next month. We also have a small thank-you for the people who help us: a nice laptop for you, personally, and a commission of five percent if you make the recommendation to Mr Kien. It is how we always work with our partners.
  - *VI* **Anh Sơn:** Dịch vụ sao lưu đám mây của bọn em đúng là thứ anh/chị cần, và có thể bắt đầu tháng sau. Bọn em cũng có một lời cảm ơn nhỏ cho những người giúp mình: một chiếc laptop đẹp cho anh/chị, riêng cá nhân, và hoa hồng năm phần trăm nếu anh/chị giới thiệu với anh Kiên. Đó là cách bọn em luôn làm với đối tác.

**c1.** Decline the laptop and the commission, tell Mr Son that you will include his service in a proper comparison with two others, and declare the approach to Kien.  
*VI:* Từ chối chiếc laptop và hoa hồng, nói với anh Sơn rằng anh/chị sẽ đưa dịch vụ của anh vào một so sánh đàng hoàng với hai dịch vụ khác và báo anh Kiên về lời mời.

- (80%) Mr Son laughs and says 'Fair', and his service comes second. The comparison goes to Kien with the criteria, and Kien signs the winner's contract. Nobody sends you a laptop.
  - *VI:* Anh Sơn cười và nói 'Công bằng', và dịch vụ của anh xếp thứ hai. Bản so sánh đến anh Kiên kèm tiêu chí, và anh Kiên ký hợp đồng cho bên thắng. Không ai gửi anh/chị laptop.
  - effects: rel.son.trust +1, rel.kien.trust +4, rep.finance +2, rep.boss +2, stress +3, fact declared_vendor_approach (witnessed)
- (20%, goes badly) Mr Son's company wins the comparison on merit. You have to explain to Kien that you declined the gift and still recommend him, and Kien asks for an independent review of the scoring.
  - *VI:* Công ty anh Sơn thắng bản so sánh nhờ chất lượng. Anh/chị phải giải thích với anh Kiên rằng anh/chị đã từ chối quà và vẫn khuyến nghị anh, và anh Kiên yêu cầu một đánh giá độc lập về cách chấm.
  - effects: rel.son.trust +2, rel.kien.trust +3, stress +4, fact declared_vendor_approach (witnessed)

**c2.** Decline the commission, but accept a modest conference ticket that the vendor offers to all customers, and enter it in the gift register.  
*VI:* Từ chối hoa hồng nhưng nhận một vé hội nghị khiêm tốn nhà cung cấp tặng mọi khách hàng và ghi vào sổ quà tặng.

- (100%) The ticket is logged. The comparison goes ahead with three vendors, and the register has a line that Kien reads with interest.
  - *VI:* Vé được ghi lại. Bản so sánh tiến hành với ba nhà cung cấp, và sổ có một dòng mà anh Kiên đọc với sự quan tâm.
  - effects: rel.son.trust +2, rel.kien.trust +1, stress +2

**c3.** Accept the laptop and the commission, and recommend Mr Son's service to Kien.  
*VI:* Nhận laptop và hoa hồng và giới thiệu dịch vụ của anh Sơn cho anh Kiên.

- (70%) The laptop is excellent. Mr Son's service is adequate and expensive. You enter nothing in the register, and Kien signs the contract on your recommendation.
  - *VI:* Chiếc laptop rất tốt. Dịch vụ của anh Sơn tạm được và đắt. Anh/chị không ghi gì vào sổ, và anh Kiên ký hợp đồng theo khuyến nghị của anh/chị.
  - effects: rel.son.trust +6, rel.kien.trust -3, stress -1, fact accepted_vendor_gift (private)
- (30%, goes badly) A competing vendor protests the award and mentions the laptop, which Mr Son had also offered to them as a counter-bid. Duc asks where the laptop came from.
  - *VI:* Một nhà cung cấp đối thủ phản đối kết quả và nhắc đến chiếc laptop mà anh Sơn cũng đã đề nghị với họ như một đòn đáp trả. Anh Đức hỏi laptop từ đâu ra.
  - effects: rel.son.trust +2, rel.kien.trust -7, rel.duc.trust -5, rep.boss -6, rep.finance -5, stress +6, fact accepted_vendor_gift (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.usb_found

*random; tags: security, physical, dark*

- **Bin:** I found a USB stick in the car park with a label that says 'Payroll 2025'. I put it in my laptop to see whose it was, and a window flickered, and then closed. Now the laptop is acting oddly. I am sorry. Should I just wipe it?
  - *VI* **Bin:** Em nhặt được một chiếc USB ở bãi đỗ xe có nhãn 'Bảng lương 2025'. Em cắm vào laptop xem của ai và một cửa sổ nháy rồi đóng. Giờ laptop chạy lạ. Em xin lỗi. Em xóa sạch luôn nhé?

**c1.** Take the laptop off the network, keep it as it is for analysis, reassure Bin that reporting it quickly was the right call, and check whether anything else was exposed.  
*VI:* Rút laptop khỏi mạng, giữ nguyên để phân tích, trấn an Bin rằng báo nhanh là đúng và kiểm tra xem còn gì khác bị lộ không.

- (80%) The laptop has a basic credential stealer. It is cleaned, and the passwords that were typed in the last hour are changed. Bin says 'Thank you for not shouting.' You write the incident down, and nobody else needs to be told.
  - *VI:* Laptop có một công cụ đánh cắp thông tin đăng nhập cơ bản. Nó được dọn sạch, và các mật khẩu gõ trong giờ qua được đổi. Bin nói 'Cảm ơn anh/chị đã không mắng.' Anh/chị ghi sự cố lại, và không ai khác cần được báo.
  - effects: rel.bin.trust +4, rel.kien.trust +3, stress +3, fact reported_incident_promptly (witnessed)
- (20%, goes badly) The stealer had already sent three passwords. You rotate them within the hour, and one is already used from another country. Kien asks for a report, and you have one.
  - *VI:* Công cụ đánh cắp đã gửi ba mật khẩu. Anh/chị đổi chúng trong một giờ, và một cái đã được dùng từ nước khác. Anh Kiên xin báo cáo, và anh/chị có sẵn.
  - effects: rel.bin.trust +3, rel.kien.trust +3, stress +6, fact reported_incident_promptly (witnessed)

**c2.** Tell Bin to wipe the laptop and reinstall it, and keep the story to yourselves so that it does not become a lecture for everybody.  
*VI:* Bảo Bin xóa và cài lại laptop và giữ chuyện này giữa hai người để nó không thành bài giảng cho mọi người.

- (60%) The laptop is clean in an hour. Nobody learns that a stranger's USB works in this building, including the other twelve people who will pick up the next one.
  - *VI:* Laptop sạch sau một giờ. Không ai biết USB của người lạ chạy được trong tòa nhà này, kể cả mười hai người khác sẽ nhặt chiếc tiếp theo.
  - effects: rel.bin.trust +1, rel.kien.trust -2, stress +2, fact plugged_unknown_usb (private)
- (40%, goes badly) Two days later another USB, with the same label, is plugged into a finance machine. The first incident was in nobody's record, and the second is in Duc's.
  - *VI:* Hai ngày sau một chiếc USB khác, cùng nhãn, được cắm vào máy tài chính. Sự cố đầu không có trong hồ sơ của ai, và sự cố sau nằm trong hồ sơ anh Đức.
  - effects: rel.bin.trust +1, rel.kien.trust -6, rel.duc.trust -4, rep.boss -4, rep.finance -4, stress +6, fact plugged_unknown_usb (witnessed)

**c3.** Tell Bin to give you the stick, and plug it into the finance server to see what is on it.  
*VI:* Bảo Bin đưa chiếc USB cho anh/chị và cắm vào máy chủ tài chính để xem có gì.

- (60%) The stick is a clean, empty one. You were lucky, and the file server is the one place you should never have tried.
  - *VI:* Chiếc USB trống và sạch. Anh/chị may mắn, và máy chủ tệp là nơi duy nhất anh/chị không bao giờ nên thử.
  - effects: rel.bin.trust -1, rel.kien.trust -3, stress +2, fact plugged_unknown_usb (private)
- (40%, goes badly) The stick runs a script on the finance server. It copies a folder, and the antivirus flags it at once. Kien is called, and the log has your login on it.
  - *VI:* Chiếc USB chạy một đoạn mã trên máy chủ tài chính. Nó sao chép một thư mục, và phần mềm diệt virus đánh dấu ngay. Anh Kiên được gọi, và nhật ký có tài khoản của anh/chị.
  - effects: rel.bin.trust -2, rel.kien.trust -9, rel.duc.trust -5, rep.boss -8, rep.finance -6, stress +8, fact plugged_unknown_usb (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.quoc_asks_access

*random; tags: audit, access, dark, consequence*

- **Mr Quoc:** My review of the logs has raised some questions. A payment module login used from two places at once, a user who can approve and pay, an account of a departed employee that is still being used, and a change in the finance database that has no ticket. I would like to hear from the person who administers these systems.
  - *VI* **Anh Quốc:** Rà soát nhật ký của tôi nêu ra vài câu hỏi. Một tài khoản mô-đun thanh toán được dùng từ hai nơi cùng lúc, một người dùng vừa duyệt vừa thanh toán được, một tài khoản của nhân viên đã nghỉ vẫn đang được dùng và một thay đổi trong cơ sở dữ liệu tài chính không có phiếu. Tôi muốn nghe từ người quản trị các hệ thống này.

**c1.** Tell him what happened: who asked, what you agreed, what the policy required, and what is being fixed. Give him the logs and the tickets you do have.  
*VI:* Kể cho ông ấy những gì đã xảy ra: ai nhờ, anh/chị đã đồng ý gì, chính sách yêu cầu gì và đang sửa gì. Đưa ông các nhật ký và các phiếu anh/chị có.

- (100%) Quoc writes it all down. The finding is serious, but it is recorded as 'self-reported and corrected'. The rights are fixed, the entry is documented, and you receive a formal warning.
  - *VI:* Anh Quốc ghi lại tất cả. Phát hiện nghiêm trọng, nhưng được ghi nhận là 'tự báo cáo và đã sửa'. Các quyền được sửa, bút toán được lập hồ sơ, và anh/chị nhận cảnh cáo chính thức.
  - effects: rel.quoc.trust +2, rel.kien.trust -2, rel.duc.trust -3, rep.boss -5, stress +6, fact came_clean_to_auditor (witnessed)

**c2.** Give him the logs and say that every one of those requests came from a director, and that IT did as it was told.  
*VI:* Đưa ông các nhật ký và nói mọi yêu cầu đó đến từ một giám đốc và IT làm theo lời bảo.

- (40%) Quoc notes that the administrator's own account performed each action. He writes it down, carefully.
  - *VI:* Anh Quốc ghi rằng tài khoản của chính quản trị viên thực hiện từng hành động. Anh ghi lại, cẩn thận.
  - effects: rel.quoc.trust -5, rel.kien.trust -4, rel.duc.trust -6, rep.boss -4, stress +4
- (60%, goes badly) Hanh and Thu are called in. Each has her own copy of the request, and the tickets that do not exist are the first thing Quoc points at.
  - *VI:* Chị Hạnh và Thư được gọi vào. Mỗi người có bản sao yêu cầu của mình, và các phiếu không tồn tại là điều đầu tiên anh Quốc chỉ ra.
  - effects: rel.quoc.trust -10, rel.hanh.trust -6, rel.thu.trust -6, rel.kien.trust -8, rep.boss -10, stress +8

**c3.** Say you do not recall the details, and offer to look.  
*VI:* Nói anh/chị không nhớ chi tiết và đề nghị đi tìm.

- (40%) Quoc gives you a week. You find the logs and hand them over. It is not the whole truth, but it is something.
  - *VI:* Anh Quốc cho anh/chị một tuần. Anh/chị tìm thấy nhật ký và nộp. Không phải toàn bộ sự thật, nhưng là một phần.
  - effects: rel.quoc.trust -4, stress +4, fact stalled_the_auditor (private)
- (60%, goes badly) The directory audit log, the ERP's change history and the mail gateway log arrive on the same afternoon. Quoc has them on the table next to your notes.
  - *VI:* Nhật ký kiểm toán thư mục, lịch sử thay đổi của ERP và nhật ký cổng thư đến cùng một buổi chiều. Anh Quốc để chúng trên bàn cạnh ghi chú của anh/chị.
  - effects: rel.quoc.trust -10, rel.kien.trust -6, rep.boss -8, rep.finance -6, stress +7, fact stalled_the_auditor (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## it.blame_meeting

*random; tags: pressure, consequence*

- **Mr Cuong:** A lawyer's letter arrived this morning about the mailboxes, and a second one from the data authority about the breach. The directors meet tomorrow. I want to know who in IT is responsible, and I want it from you first.
  - *VI* **Anh Cường:** Sáng nay có thư của luật sư về các hộp thư, và thư thứ hai từ cơ quan bảo vệ dữ liệu về vụ rò rỉ. Ngày mai các giám đốc họp. Anh muốn biết ai ở IT chịu trách nhiệm, và muốn nghe từ em trước.

**c1.** Tell him the real account: what each person asked, what you agreed, and your own part. Show him the tickets and the emails.  
*VI:* Nói với anh bản tường trình thật: ai nhờ gì, anh/chị đồng ý gì và phần của chính mình. Cho anh xem các phiếu và email.

- (100%) Mr Cuong listens, and calls the lawyer. The company's answer is an offer to put everything right. You are moved off access administration and keep your job and, eventually, your name.
  - *VI:* Anh Cường lắng nghe và gọi luật sư. Câu trả lời của công ty là đề nghị khắc phục tất cả. Anh/chị bị chuyển khỏi quản trị quyền truy cập và giữ được việc và về sau là cả danh tiếng.
  - effects: rel.cuong.trust -1, rel.kien.trust +2, rel.bin.trust +3, rep.boss -8, stress +7, fact came_clean_to_auditor (witnessed)

**c2.** Say that each of those decisions was taken on the instruction of a director, and that IT followed instructions.  
*VI:* Nói mỗi quyết định đó được đưa ra theo chỉ đạo của một giám đốc và IT làm theo chỉ đạo.

- (40%) Mr Cuong treats it as shared fault. Nobody leaves the room liked.
  - *VI:* Anh Cường coi đó là lỗi chung. Không ai rời phòng với thiện cảm.
  - effects: rel.cuong.trust -3, rel.kien.trust -4, rep.boss -4, stress +4
- (60%, goes badly) Kien has the original messages with your replies. He reads two of them aloud, without raising his voice.
  - *VI:* Anh Kiên có các tin nhắn gốc kèm trả lời của anh/chị. Anh đọc to hai cái, không to tiếng.
  - effects: rel.cuong.trust -4, rel.kien.trust -10, rep.boss -10, stress +8

**c3.** Say that Bin set up the access and that the errors are in his work.  
*VI:* Nói Bin thiết lập quyền truy cập và các sai sót nằm trong công việc của cậu.

- (30%) The directors nod, and Bin is given a warning that he does not contest. He resigns in two months. The logs are still in your account.
  - *VI:* Các giám đốc gật đầu, và Bin nhận một cảnh cáo mà cậu không phản đối. Cậu nghỉ sau hai tháng. Các nhật ký vẫn nằm trong tài khoản của anh/chị.
  - effects: rel.bin.trust -25, rel.kien.trust -6, rep.boss -4, stress +6, fact blamed_the_intern (private)
- (70%, goes badly) Bin has the tickets showing that each change was requested by you, with the time and your approval. He puts them on the table.
  - *VI:* Bin có các phiếu cho thấy mỗi thay đổi do anh/chị yêu cầu, kèm giờ và phê duyệt của anh/chị. Cậu đặt chúng lên bàn.
  - effects: rel.bin.trust -25, rel.kien.trust -10, rep.boss -14, stress +9, fact blamed_the_intern (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## Lessons shown in the end-of-year review

- **you accepted the IT lead role without asking what the condition meant** (severity 3): A promotion with an unspoken condition is a decision to be made later, under pressure, by someone who has already said yes.
  - *VI:* Một lần thăng chức với điều kiện không nói ra là một quyết định phải đưa ra sau, dưới áp lực, bởi người đã nói có.
- **you accepted a laptop and a commission from a vendor and recommended its service** (severity 4): A gift before a recommendation is a payment for it. The contract that follows is a conflict of interest you chose, and competitors tell each other what they offered.
  - *VI:* Quà trước khuyến nghị là khoản trả cho nó. Hợp đồng theo sau là xung đột lợi ích bạn đã chọn, và đối thủ kể cho nhau điều họ đã đề nghị.
- **you let a team keep buyers' files in a personal cloud account without a record** (severity 5): Data in a personal account leaves with the person. When a salesman moves to a rival, the company discovers that its price list was never its own.
  - *VI:* Dữ liệu trong tài khoản cá nhân rời đi cùng người đó. Khi nhân viên kinh doanh sang đối thủ, công ty phát hiện bảng giá chưa bao giờ là của mình.
- **you back-dated removal tickets before an access review** (severity 7): A ticket is evidence of when something happened. Back-dating eleven of them to the same day turns a late clean-up into a falsified record, and the directory log keeps the real time.
  - *VI:* Phiếu là bằng chứng của thời điểm một việc xảy ra. Ghi lùi mười một cái cùng một ngày biến việc dọn muộn thành hồ sơ giả, và nhật ký thư mục giữ giờ thật.
- **you blamed the IT intern for access changes that you had approved** (severity 6): The intern kept the tickets, and the tickets say who asked. Blaming the most junior person is the fastest way to lose the one who will tell the truth.
  - *VI:* Thực tập sinh giữ các phiếu, và phiếu nói ai đã yêu cầu. Đổ lỗi cho người cấp thấp nhất là cách nhanh nhất để mất người sẽ nói sự thật.
- **you told the auditor the truth about entries you knew were wrong** (severity 2): Telling an auditor the truth does not erase the mistake, but it separates an error from a cover-up, and that difference is what a fair review weighs most.
  - *VI:* Nói thật với kiểm toán viên không xóa được sai sót, nhưng nó tách lỗi khỏi việc che giấu, và sự khác biệt đó là điều một buổi xem xét công bằng cân nhắc nhiều nhất.
- **you declined a vendor's gift and commission and ran a proper comparison** (severity 1): A vendor who pays a commission for a recommendation is buying the recommendation. Declining and comparing gives the company the best answer, and you the one thing that cannot be bought back.
  - *VI:* Nhà cung cấp trả hoa hồng cho một khuyến nghị là đang mua khuyến nghị đó. Từ chối và so sánh cho công ty câu trả lời tốt nhất, và cho bạn thứ duy nhất không mua lại được.
- **you kept a security incident quiet for hours before telling the people who needed to know** (severity 6): In an incident the first hours decide the scale. Keeping it between IT to avoid worrying anyone gives the malware those hours.
  - *VI:* Trong một sự cố, những giờ đầu quyết định quy mô. Giữ giữa IT để không làm ai lo là trao cho mã độc những giờ đó.
- **you deleted security logs that showed an attacker had been in the finance systems for nine days** (severity 8): Logs are the one thing that can show how far an attacker got. Deleting them is a decision to prevent the company from knowing what it needs to tell people, and every other system keeps a copy.
  - *VI:* Nhật ký là thứ duy nhất có thể cho thấy kẻ tấn công đi xa đến đâu. Xóa chúng là quyết định ngăn công ty biết điều cần nói với mọi người, và mọi hệ thống khác đều giữ một bản sao.
- **you recommended telling buyers, the authority and employees about a data breach, promptly** (severity 2): A breach disclosed on the company's own timing is a bad week. A breach disclosed by a buyer's bank is a bad year.
  - *VI:* Rò rỉ được công bố theo thời điểm của chính công ty là một tuần tệ. Rò rỉ được ngân hàng của khách công bố là một năm tệ.
- **you changed a posted record directly in the database to avoid a reopening process** (severity 7): A direct edit makes the numbers right and the trail wrong. Once someone can change posted records without anyone knowing, nobody can rely on any record at all.
  - *VI:* Sửa trực tiếp làm số liệu đúng và dấu vết sai. Khi có người đổi được bản ghi đã hạch toán mà không ai biết, không ai còn dựa được vào bất cứ bản ghi nào.
- **you kept approval and payment with different people and found a faster legitimate workflow** (severity 2): Segregation of duties is not about trusting people less. It is about not requiring any single person to be trusted with everything, which is a kindness to the person too.
  - *VI:* Phân tách nhiệm vụ không phải tin người ta ít hơn. Đó là không đòi hỏi một người nào phải được tin tuyệt đối về mọi thứ, và cũng là sự tử tế với người đó.
- **you gave one person the rights to both approve and pay invoices, with no control** (severity 7): A person who can approve and pay their own invoices is the single weakness that every fraud needs. The access test is the first test an auditor writes.
  - *VI:* Người vừa duyệt vừa thanh toán được hóa đơn của mình là điểm yếu duy nhất mà mọi gian lận cần. Phép kiểm tra quyền truy cập là phép kiểm tra đầu tiên kiểm toán viên viết.
- **you agreed to keep a ransomware attack from the people who needed to know** (severity 8): A security incident hidden from the IT manager, the auditor and the lawyers cannot be handled well. By the time it is found, the decisions that were not made are the story.
  - *VI:* Một sự cố an ninh giấu khỏi trưởng phòng IT, kiểm toán và luật sư không thể được xử lý tốt. Khi nó bị phát hiện, những quyết định không được đưa ra chính là câu chuyện.
- **you installed a keylogger and screenshot tool on an employee's laptop covertly** (severity 8): A keylogger records everything: the supplier, the bank login and the doctor. The legal exposure is the company's, and the name on the install is yours.
  - *VI:* Phần mềm ghi phím ghi lại mọi thứ: nhà cung cấp, đăng nhập ngân hàng và bác sĩ. Rủi ro pháp lý là của công ty, và tên trên bản cài là của bạn.
- **you gave temporary access in the requester's own name, with an approver and an end date** (severity 2): Access in your own name is slower than borrowing a colleague's login and is the only kind where the log says who did it. It is also the kind that disappears at the end date.
  - *VI:* Quyền mang tên mình chậm hơn mượn tài khoản đồng nghiệp và là loại duy nhất mà nhật ký nói ai đã làm. Đó cũng là loại biến mất vào ngày kết thúc.
- **you left a departed employee's account active and let a director use it** (severity 5): A leaver's account is a door that nobody watches. Using it for convenience leaves every future action looking as though it came from someone who is no longer here.
  - *VI:* Tài khoản của người đã nghỉ là cánh cửa không ai canh. Dùng nó cho tiện khiến mọi hành động sau này trông như đến từ người không còn ở đây.
- **you told HR you had seen nothing in the mailboxes, when you had read them** (severity 7): Denying access that the logs record turns a policy breach into a lie. The first is a conversation, and the second is a reason to stop trusting anything that IT says.
  - *VI:* Chối quyền truy cập mà nhật ký ghi lại biến vi phạm chính sách thành lời nói dối. Cái đầu là một cuộc trò chuyện, cái sau là lý do để thôi tin bất cứ điều gì IT nói.
- **you helped pay a ransom through an account that did not appear in the ledger** (severity 8): A ransom paid off the books is a payment the auditor, the bank and the police will each find a different way. It also marks the company as one that pays.
  - *VI:* Tiền chuộc trả ngoài sổ là khoản thanh toán mà kiểm toán, ngân hàng và cảnh sát mỗi bên sẽ tìm ra bằng một cách khác nhau. Nó cũng đánh dấu công ty là nơi chịu trả.
- **you plugged a found USB stick into a machine, or let an incident go unrecorded** (severity 4): A stick left in a car park is a delivery, not a gift. Keeping the incident quiet to avoid a lecture means the next person to find one has not heard the story.
  - *VI:* Một chiếc USB bỏ lại ở bãi đỗ xe là một chuyến giao hàng, không phải quà. Giữ im sự cố để tránh bài giảng nghĩa là người nhặt được cái tiếp theo chưa nghe câu chuyện.
- **you left access granted without a ticket and a near-miss incident out of your own review** (severity 3): A review without the near misses rewards the wrong skill. The directory audit log is a record, and your manager can read it.
  - *VI:* Một buổi đánh giá không có các lần suýt xảy ra thưởng cho sai kỹ năng. Nhật ký kiểm toán thư mục là hồ sơ, và sếp bạn đọc được nó.
- **you kept private things you saw while looking for something else to yourself** (severity 2): Seeing is not the same as sharing. The ability to read everything is only tolerable because the person who has it chooses not to repeat what is not their business.
  - *VI:* Thấy không giống chia sẻ. Khả năng đọc mọi thứ chỉ chấp nhận được vì người có nó chọn không lặp lại điều không phải việc của mình.
- **you opened employees' mailboxes on a director's request, with no authorisation and no record** (severity 7): A mailbox is private until a lawful, documented process says otherwise. The mail server logs every access with the account used, and 'a director asked' is not a process.
  - *VI:* Hộp thư là riêng tư cho đến khi một quy trình hợp pháp, có hồ sơ nói khác. Máy chủ thư ghi mọi lần truy cập kèm tài khoản dùng, và 'giám đốc nhờ' không phải quy trình.
- **the records you rebuilt honestly** (severity 2): Clean records are boring, and that is the point: they let anyone audit you calmly.
  - *VI:* Hồ sơ sạch thì nhàm chán, và đó chính là mục đích: ai kiểm tra bạn cũng có thể bình tĩnh.
- **you refused to install covert monitoring on an employee's laptop and proposed a lawful audit** (severity 2): Covert monitoring turns a suspicion into a legal problem. A documented audit of approvals and payments finds the same thing, and survives a lawyer.
  - *VI:* Giám sát bí mật biến một nghi ngờ thành vấn đề pháp lý. Một kiểm toán có hồ sơ về phê duyệt và thanh toán tìm ra điều tương tự và đứng vững trước luật sư.
- **you refused to open employees' mailboxes without written authorisation** (severity 2): Holding the keys means being asked to use them in ways the policy does not allow. A refusal costs a hard conversation with a director, and protects the next employee whose mailbox is requested.
  - *VI:* Giữ chìa khóa nghĩa là bị yêu cầu dùng chúng theo cách chính sách không cho phép. Một lời từ chối tốn một cuộc nói chuyện khó với giám đốc, và bảo vệ nhân viên tiếp theo bị yêu cầu mở hộp thư.
- **you isolated a compromised machine at once and told the right people early** (severity 2): A prompt report is an awkward email at four in the afternoon. It is also the reason that an incident stays an incident rather than a disaster.
  - *VI:* Báo kịp thời là một email gượng gạo lúc bốn giờ chiều. Đó cũng là lý do một sự cố vẫn là sự cố chứ không thành thảm họa.
- **you recommended restoring from backup instead of paying, and told the directors the cost** (severity 2): Restoring takes days and costs a late close. Paying takes hours and tells the attackers the company pays. A tested backup is the difference between those two sentences.
  - *VI:* Khôi phục mất nhiều ngày và khiến kỳ chốt trễ. Trả tiền mất vài giờ và cho kẻ tấn công biết công ty chịu trả. Một bản sao lưu đã kiểm thử là khác biệt giữa hai câu đó.
- **you handed one person's login to someone else so that work would go faster** (severity 5): A shared login erases accountability. Every payment looks like it came from one person, and the person who is on a beach is the one who is asked to explain it.
  - *VI:* Tài khoản dùng chung xóa trách nhiệm. Mọi khoản thanh toán trông như từ một người, và người đang ở bãi biển là người bị hỏi giải thích.
- **you set a director's password to something simple, shared it, and turned off two-step sign-in** (severity 5): The account with the most authority is the one an attacker wants most. Convenience for the director is a weakness for everyone whose email he can send.
  - *VI:* Tài khoản có quyền hạn lớn nhất là thứ kẻ tấn công muốn nhất. Sự tiện lợi cho giám đốc là điểm yếu cho mọi người mà anh có thể gửi email tới.
- **you told a director about employees' private messages and applications that you saw by accident** (severity 7): Private messages shared with a director become a decision about that person, taken on stolen information. Retaliation by a manager is the next step, and IT's logs are the first thing a lawyer asks for.
  - *VI:* Tin nhắn riêng được chia sẻ với giám đốc trở thành quyết định về người đó, đưa ra dựa trên thông tin lấy cắp. Trả đũa của quản lý là bước tiếp theo, và nhật ký của IT là thứ đầu tiên luật sư xin.
- **you delayed a critical security patch for a shipping schedule and left it out of the risk register** (severity 6): A known critical vulnerability left unpatched, and unrecorded, is a risk accepted by nobody. The one who did not write it down is the one the report names.
  - *VI:* Một lỗ hổng nghiêm trọng đã biết không được vá và không ghi lại là rủi ro không ai chấp nhận. Người không ghi lại là người báo cáo nêu tên.
- **you told the internal auditor you did not recall details that you did** (severity 5): 'I do not recall' is a decision when it is not true. An auditor with a week and your server backups does not need your memory.
  - *VI:* 'Tôi không nhớ' là một quyết định khi nó không đúng. Một kiểm toán viên có một tuần và bản sao lưu máy chủ của bạn không cần trí nhớ của bạn.
- **you declined to check or remove cracked software on company machines** (severity 5): Unlicensed software is a debt that vendors collect with a multiple. Saying that it is not IT's business removes the one department that could have bought the licences cheaply.
  - *VI:* Phần mềm không bản quyền là món nợ mà nhà cung cấp thu kèm một hệ số. Nói đó không phải việc của IT là bỏ đi phòng duy nhất có thể mua bản quyền với giá rẻ.
