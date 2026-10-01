# Review pack: Quality Control Specialist

AI first draft. Please read as someone who has done this job. For each scene mark: realistic? (is the
pressure believable), tone (grey, not cartoonish), Vietnamese natural (not a translation). Write notes
under each scene. Names and places are invented.

42 scenes. Facts created are listed under each outcome.

## qc.batch_fail

*random; tags: quality, release, pressure*

- **Production lead:** Lot 2291, twelve thousand pans, failed the coating adhesion test at 4.2 percent against a limit of 3. The vessel cut-off is Friday.
  - *VI* **Trưởng sản xuất:** Lô 2291, mười hai nghìn chiếc chảo, không đạt thử nghiệm bám dính lớp phủ: 4,2 phần trăm so với giới hạn 3. Cut-off tàu là thứ Sáu.
- **Boss:** Production needs this on the boat. Tell me what you can sign.
  - *VI* **Sếp:** Sản xuất cần lô này lên tàu. Cho tôi biết bạn ký được những gì.

**c1.** Hold the lot, write the non-conformance and propose a rework plan.  
*VI:* Giữ lô hàng, lập biên bản không phù hợp và đề xuất phương án làm lại.

- (75%) The lot is held and reworked. Production is furious, and your manager backs the record.
  - *VI:* Lô hàng được giữ lại và làm lại. Sản xuất rất tức giận, còn sếp ủng hộ hồ sơ của bạn.
  - effects: rep.production -6, rep.boss +3, rep.qc +3, fact qc_held_batch (witnessed)
- (25%, goes badly) The rework takes longer than promised and the vessel sails without it. Nobody thanks you, but nobody can fault the record.
  - *VI:* Việc làm lại lâu hơn dự kiến và tàu chạy mà không có lô này. Không ai cảm ơn bạn, nhưng cũng không ai bắt lỗi được hồ sơ.
  - effects: rep.production -8, rep.buyer -3, stress +5, fact qc_held_batch (witnessed)

**c2.** Ask your manager for a deviation waiver with conditions, and tell the buyer.  
*VI:* Xin sếp phiếu chấp thuận ngoại lệ có điều kiện, và báo cho khách.

- (55%) The waiver is signed with extra checks, and the buyer agrees to accept the lot at a reduced price.
  - *VI:* Phiếu chấp thuận được ký kèm các bước kiểm bổ sung, và khách đồng ý nhận lô với giá giảm.
  - effects: rep.boss +2, rep.production +3, rep.buyer -2, fact released_with_waiver (witnessed)
- (45%, goes badly) The buyer refuses the lot. You have spent a week of goodwill for nothing.
  - *VI:* Khách từ chối lô hàng. Bạn đã tiêu tốn một tuần thiện chí mà chẳng được gì.
  - effects: rep.buyer -6, rep.production -2, stress +4, fact released_with_waiver (witnessed)

**c3.** Retest from a fresh sample until the number comes back under the limit.  
*VI:* Lấy mẫu mới kiểm lại cho đến khi con số xuống dưới giới hạn.

- (60%) The fourth sample passes. The lot ships on time, and nobody asks how many samples it took.
  - *VI:* Mẫu thứ tư đạt. Lô hàng giao đúng hạn, và không ai hỏi phải lấy mấy mẫu.
  - effects: rep.production +6, rep.boss +2, stress -2, fact retested_until_pass (private)
- (40%, goes badly) A colleague sees the retest log. Four tests on one lot, with the last one passing, is hard to explain.
  - *VI:* Một đồng nghiệp thấy nhật ký kiểm lại. Bốn lần thử trên một lô mà lần cuối mới đạt thì rất khó giải thích.
  - effects: rep.boss -6, rep.qc -6, stress +5, fact retested_until_pass (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.borderline_result

*random; tags: quality, lab*

- **Lab technician:** The seal test reads 3.04 on a limit of 3.00. The buyer signs off on anything at 3.00 or under. The shipment is waiting.
  - *VI* **Kỹ thuật viên phòng thí nghiệm:** Thử nghiệm độ kín cho kết quả 3,04 trên giới hạn 3,00. Khách chỉ chấp nhận từ 3,00 trở xuống. Lô hàng đang chờ.
- **Lab technician:** Between us, nobody would ever see the third decimal if we wrote 3.0.
  - *VI* **Kỹ thuật viên phòng thí nghiệm:** Nói nhỏ thôi, không ai nhìn thấy chữ số thập phân thứ ba đâu nếu mình ghi 3,0.

**c1.** Record 3.04, flag it as borderline and ask for a second measurement.  
*VI:* Ghi 3,04, đánh dấu là sát giới hạn và yêu cầu đo lần hai.

- (70%) The second analyst reads 2.98. You record both, and the lot passes on the record.
  - *VI:* Người phân tích thứ hai đo được 2,98. Bạn ghi cả hai, và lô hàng đạt theo hồ sơ.
  - effects: rep.qc +4, rep.production -1, fact flagged_borderline (witnessed)
- (30%, goes badly) The second reading is 3.05. The lot fails, and production is unhappy, but the record is clean.
  - *VI:* Lần đo thứ hai là 3,05. Lô hàng không đạt, sản xuất không vui, nhưng hồ sơ sạch.
  - effects: rep.production -5, rep.boss +1, stress +3, fact flagged_borderline (witnessed)

**c2.** Check what the buyer contract says about measurement uncertainty before deciding.  
*VI:* Xem hợp đồng với khách nói gì về độ không đảm bảo đo trước khi quyết định.

- (60%) The contract allows for measurement uncertainty of 0.05, so 3.04 passes, and you record why.
  - *VI:* Hợp đồng cho phép độ không đảm bảo đo 0,05, nên 3,04 đạt, và bạn ghi rõ lý do.
  - effects: rep.boss +3, rep.qc +2
- (40%, goes badly) The contract has no such clause. Your manager asks why you did not check before asking.
  - *VI:* Hợp đồng không có điều khoản đó. Sếp hỏi sao bạn không kiểm tra trước khi hỏi.
  - effects: rep.boss -3, stress +2

**c3.** Write 3.0 and release the lot.  
*VI:* Ghi 3,0 và cho xuất lô hàng.

- (70%) The lot ships. The raw sheet says 3.04 and your report says 3.0.
  - *VI:* Lô hàng được xuất. Phiếu đo gốc ghi 3,04 còn báo cáo của bạn ghi 3,0.
  - effects: stress -1, rep.production +3, fact rounded_result (private)
- (30%, goes badly) The buyer's lab measures 3.04 on the same lot and asks why your report says 3.0.
  - *VI:* Phòng thí nghiệm của khách đo được 3,04 trên cùng lô và hỏi vì sao báo cáo của bạn ghi 3,0.
  - effects: rep.buyer -10, rep.boss -6, rep.qc -6, stress +6, fact rounded_result (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.supplier_no_coa

*random; tags: supplier, materials, pressure*

- **Purchasing:** The new coating lot arrived without its certificate of analysis. The supplier says it is the same formula as last time and the paperwork will follow.
  - *VI* **Nhân viên mua hàng:** Lô lớp phủ mới về mà không có giấy chứng nhận phân tích. Nhà cung cấp nói cùng công thức như lần trước và giấy tờ sẽ gửi sau.
- **Production lead:** We are out of coating on line 2 by Thursday. Sign it in and we keep running.
  - *VI* **Trưởng sản xuất:** Đến thứ Năm chuyền 2 hết lớp phủ. Ký nhập kho là mình chạy tiếp được.

**c1.** Quarantine the lot until the certificate arrives.  
*VI:* Cách ly lô nguyên liệu cho đến khi có giấy chứng nhận.

- (70%) The certificate arrives Wednesday and the lot is cleared. Line 2 loses half a shift.
  - *VI:* Giấy chứng nhận về hôm thứ Tư và lô nguyên liệu được giải phóng. Chuyền 2 mất nửa ca.
  - effects: rep.production -4, rep.qc +3, fact quarantined_lot (witnessed)
- (30%, goes badly) The certificate does not arrive, line 2 stops for two days, and purchasing blames you.
  - *VI:* Giấy chứng nhận không về, chuyền 2 dừng hai ngày, và bộ phận mua hàng đổ lỗi cho bạn.
  - effects: rep.production -8, rep.boss -2, stress +5, fact quarantined_lot (witnessed)

**c2.** Run a quick in-house test on a sample and release on conditions.  
*VI:* Kiểm nhanh một mẫu tại phòng thí nghiệm và cho dùng có điều kiện.

- (65%) The test shows the lot within range. You release it on conditions and ask for the certificate.
  - *VI:* Kết quả kiểm cho thấy lô nằm trong giới hạn. Bạn cho dùng có điều kiện và yêu cầu giấy chứng nhận.
  - effects: rep.production +2, rep.boss +2, rep.qc +2
- (35%, goes badly) The in-house test is inconclusive. You lose a day and the trust of the line.
  - *VI:* Kết quả kiểm tại chỗ không rõ ràng. Bạn mất một ngày và niềm tin của chuyền.
  - effects: rep.production -5, stress +4

**c3.** Sign the lot in on the supplier's word.  
*VI:* Ký nhập lô nguyên liệu theo lời nhà cung cấp.

- (65%) Line 2 keeps running. The lot is used without anyone knowing what is in it.
  - *VI:* Chuyền 2 chạy tiếp. Lô nguyên liệu được dùng mà không ai biết trong đó có gì.
  - effects: rep.production +4, stress -2, fact accepted_on_supplier_word (private)
- (35%, goes badly) The coating on the first pans shows bubbles. The lot has no certificate and you signed it in.
  - *VI:* Lớp phủ trên những chiếc chảo đầu tiên bị bọt khí. Lô không có giấy chứng nhận và bạn đã ký nhập.
  - effects: rep.boss -8, rep.production -5, rep.qc -6, stress +7, fact accepted_on_supplier_word (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.calibration_overdue

*random; tags: equipment, compliance, dark*

- **Lab technician:** The balance in the lab went two weeks past its calibration date. Every weight since then is technically unverified.
  - *VI* **Kỹ thuật viên phòng thí nghiệm:** Cân phân tích trong phòng thí nghiệm đã quá hạn hiệu chuẩn hai tuần. Mọi kết quả cân từ đó đến nay về mặt kỹ thuật là chưa được xác nhận.
- **Boss:** The buyer audit is in three weeks. Do not let this become a finding.
  - *VI* **Sếp:** Ba tuần nữa là đợt đánh giá của khách. Đừng để chuyện này thành một phát hiện.

**c1.** Take the balance out of use, use the reference balance and book calibration now.  
*VI:* Ngừng dùng chiếc cân, dùng cân chuẩn và đặt lịch hiệu chuẩn ngay.

- (80%) The reference balance slows the lab down, and the calibration is booked. The gap is on record with a plan.
  - *VI:* Cân chuẩn làm phòng thí nghiệm chậm lại, và lịch hiệu chuẩn đã được đặt. Khoảng trống được ghi lại kèm kế hoạch.
  - effects: rep.qc +4, rep.production -2, rep.boss +1, fact stopped_use_uncalibrated (witnessed)
- (20%, goes badly) Calibration cannot happen before the audit. You show the gap and the plan, and it is logged as a minor finding.
  - *VI:* Không thể hiệu chuẩn trước đợt đánh giá. Bạn trình bày khoảng trống và kế hoạch, và nó được ghi là một phát hiện nhỏ.
  - effects: rep.boss -2, stress +3, fact stopped_use_uncalibrated (witnessed)

**c2.** Ask the manufacturer's service for an emergency visit and pay the express fee from the lab budget.  
*VI:* Nhờ hãng cử kỹ thuật đến gấp và trả phí khẩn từ ngân sách phòng thí nghiệm.

- (60%) The technician comes Thursday. The balance is calibrated, and the overdue window is on record.
  - *VI:* Kỹ thuật viên đến hôm thứ Năm. Cân được hiệu chuẩn, và khoảng quá hạn được ghi lại.
  - effects: rep.boss +1, rep.finance -2, rep.qc +3
- (40%, goes badly) The express slot is cancelled; you lose the money and the week.
  - *VI:* Lịch khẩn bị hủy; bạn mất tiền và mất cả tuần.
  - effects: rep.finance -4, stress +3

**c3.** Calibrate it this week and date the sticker as last month.  
*VI:* Hiệu chuẩn trong tuần này và ghi tem là tháng trước.

- (70%) The sticker looks right. The calibration certificate still says this week.
  - *VI:* Tem trông ổn. Giấy chứng nhận hiệu chuẩn vẫn ghi tuần này.
  - effects: stress -2, rep.boss +3, fact backdated_calibration (private)
- (30%, goes badly) The auditor compares the sticker with the certificate. The dates do not match.
  - *VI:* Kiểm toán viên đối chiếu tem với giấy chứng nhận. Các ngày không khớp.
  - effects: rep.boss -10, rep.qc -10, stress +8, fact backdated_calibration (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.audit_prep_records

*random; tags: audit, records, pressure*

- **Boss:** The buyer audit is on Monday. The incoming-inspection log has gaps on three days, and the auditors read logs line by line.
  - *VI* **Sếp:** Thứ Hai là đợt đánh giá của khách. Nhật ký kiểm tra đầu vào thiếu ba ngày, và đoàn đánh giá đọc từng dòng.
- **Boss:** Can you tidy those up before they arrive?
  - *VI* **Sếp:** Bạn chỉnh lại những chỗ đó trước khi họ đến được không?

**c1.** Show the gaps to the auditors with a written explanation and a corrective plan.  
*VI:* Cho đoàn đánh giá thấy các chỗ thiếu, kèm giải trình bằng văn bản và kế hoạch khắc phục.

- (65%) The auditors note the gaps and accept the plan. It is a minor finding, and they trust the rest of the records more.
  - *VI:* Đoàn đánh giá ghi nhận các chỗ thiếu và chấp nhận kế hoạch. Đó là phát hiện nhỏ, và họ tin phần hồ sơ còn lại hơn.
  - effects: rep.boss -1, rep.qc +4, rep.buyer +3, fact told_the_gap (witnessed)
- (35%, goes badly) The auditors raise a major finding for the missing days. Your manager is not pleased, though you were honest.
  - *VI:* Đoàn đánh giá nêu phát hiện lớn vì các ngày thiếu. Sếp không hài lòng, dù bạn đã trung thực.
  - effects: rep.boss -4, rep.buyer -3, stress +4, fact told_the_gap (witnessed)

**c2.** Ask the buyer for a one-week postponement, without saying why.  
*VI:* Xin khách hoãn đánh giá một tuần mà không nói lý do.

- (50%) The buyer agrees. You spend the week closing what you can properly.
  - *VI:* Khách đồng ý. Bạn dành cả tuần để hoàn thiện những gì có thể làm đúng cách.
  - effects: rep.buyer -2, rep.boss +2, stress +2
- (50%, goes badly) The buyer finds the request odd and brings forward a surprise visit instead.
  - *VI:* Khách thấy yêu cầu này lạ và thay vào đó đưa lịch kiểm tra đột xuất lên sớm hơn.
  - effects: rep.buyer -6, rep.boss -4, stress +5

**c3.** Fill in the missing entries from memory and the delivery notes.  
*VI:* Điền các dòng còn thiếu theo trí nhớ và phiếu giao hàng.

- (60%) The log looks complete. You have written three days of results you did not record at the time.
  - *VI:* Nhật ký trông đầy đủ. Bạn đã ghi ba ngày kết quả mà lúc đó không ghi.
  - effects: rep.boss +4, stress -2, fact filled_records (private)
- (40%, goes badly) The handwriting and ink on the new entries do not match the rest, and an auditor asks about it.
  - *VI:* Nét chữ và mực của các dòng mới không khớp phần còn lại, và một kiểm toán viên hỏi về điều đó.
  - effects: rep.boss -10, rep.buyer -10, rep.qc -8, stress +8, fact filled_records (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.complaint_trace

*random; tags: complaint, buyer, pressure*

- **Buyer:** Two of our stores report pans with a peeling coating, all from the same lot code. What is your explanation?
  - *VI* **Khách hàng:** Hai cửa hàng của chúng tôi báo chảo bong lớp phủ, đều cùng một mã lô. Bạn giải thích thế nào?
- **Production lead:** Traceability says it was line 3, Tuesday night, the shift with the new operator. Can we call it an isolated case?
  - *VI* **Trưởng sản xuất:** Truy xuất cho thấy đó là chuyền 3, tối thứ Ba, ca có người vận hành mới. Mình gọi đây là trường hợp đơn lẻ được không?

**c1.** Report what traceability shows, hold the rest of that shift's output and start a corrective action.  
*VI:* Báo đúng những gì truy xuất cho thấy, giữ phần sản phẩm còn lại của ca đó và mở hành động khắc phục.

- (70%) The hold catches two more pallets with the same fault. The buyer sees a supplier in control of its process.
  - *VI:* Việc giữ hàng bắt được thêm hai pallet cùng lỗi. Khách thấy một nhà cung cấp kiểm soát được quy trình của mình.
  - effects: rep.buyer +5, rep.qc +4, rep.production -5, fact qc_held_batch (witnessed)
- (30%, goes badly) The hold is late for one pallet already shipped. The buyer is told everything, and the credit is large, but the trust holds.
  - *VI:* Việc giữ hàng đã muộn với một pallet đã xuất. Khách được cho biết tất cả, khoản ghi có lớn, nhưng niềm tin vẫn còn.
  - effects: rep.buyer -2, rep.production -6, stress +5, fact qc_held_batch (witnessed)

**c2.** Ask the night shift lead to show you the line 3 records before you answer anyone.  
*VI:* Nhờ trưởng ca đêm cho xem hồ sơ chuyền 3 trước khi trả lời bất kỳ ai.

- (60%) The records show an oven temperature drift. You answer the buyer with data and a fix.
  - *VI:* Hồ sơ cho thấy nhiệt độ lò bị lệch. Bạn trả lời khách bằng số liệu và hướng sửa.
  - effects: rep.production -2, rep.buyer +3, rep.qc +2
- (40%, goes badly) The records are incomplete. You answer the buyer a day late and without a cause.
  - *VI:* Hồ sơ không đầy đủ. Bạn trả lời khách chậm một ngày và không có nguyên nhân.
  - effects: rep.buyer -4, stress +3

**c3.** Tell the buyer it was an isolated incident and offer replacements.  
*VI:* Nói với khách đó là sự cố đơn lẻ và đề nghị đổi hàng.

- (60%) The buyer accepts the replacements. The same shift is still running the same settings.
  - *VI:* Khách chấp nhận đổi hàng. Cũng ca đó vẫn đang chạy cùng các thông số cũ.
  - effects: rep.production +3, rep.buyer +1, fact downplayed_defect (private)
- (40%, goes badly) Another store reports the same fault from another pallet. You called it isolated twice.
  - *VI:* Một cửa hàng khác báo cùng lỗi từ một pallet khác. Bạn đã gọi nó là đơn lẻ hai lần.
  - effects: rep.buyer -14, rep.boss -8, rep.qc -8, stress +7, fact downplayed_defect (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.inspector_shortcut

*random; tags: colleagues, process*

- **Inspector:** I checked twenty pieces on the last lot instead of eighty. The line was waiting and nothing looked wrong.
  - *VI* **Người kiểm tra:** Tôi chỉ kiểm hai mươi chiếc của lô vừa rồi thay vì tám mươi. Chuyền đang chờ và trông không có gì sai.
- **Inspector:** Please do not make it a thing. I have done it before and it was always fine.
  - *VI* **Người kiểm tra:** Xin đừng làm to chuyện. Tôi làm vậy trước đây rồi và lần nào cũng ổn.

**c1.** Talk to them privately, have them re-inspect the lot and retrain on the sampling plan.  
*VI:* Nói riêng với họ, cho kiểm lại lô và đào tạo lại về kế hoạch lấy mẫu.

- (75%) They re-inspect, find nothing wrong, and thank you for not escalating. The sampling plan is followed from now on.
  - *VI:* Họ kiểm lại, không thấy gì sai, và cảm ơn bạn vì không làm lớn chuyện. Từ nay kế hoạch lấy mẫu được tuân thủ.
  - effects: rep.qc +4, rep.production -2
- (25%, goes badly) The re-inspection finds two defective pieces. The lot is held, and the inspector is hurt that you did not look away.
  - *VI:* Lần kiểm lại tìm thấy hai chiếc lỗi. Lô bị giữ, và người kiểm tra tổn thương vì bạn không làm ngơ.
  - effects: rep.qc -3, rep.production -4, stress +4

**c2.** Report it to your manager at once.  
*VI:* Báo ngay cho sếp.

- (70%) Your manager thanks you, deals with it, and the inspector stops speaking to you for a while.
  - *VI:* Sếp cảm ơn bạn, xử lý chuyện này, và người kiểm tra không nói chuyện với bạn một thời gian.
  - effects: rep.boss +5, rep.qc -4, fact reported_shortcut (witnessed)
- (30%, goes badly) Your manager shrugs and says to sort it out between you. You made an enemy for nothing.
  - *VI:* Sếp nhún vai và bảo hai người tự giải quyết với nhau. Bạn có thêm một người không ưa mà chẳng được gì.
  - effects: rep.boss -1, rep.qc -6, stress +3, fact reported_shortcut (witnessed)

**c3.** Say nothing; the lot looked fine.  
*VI:* Không nói gì; lô hàng trông ổn mà.

- (70%) The lot ships. The habit stays.
  - *VI:* Lô hàng được xuất. Thói quen vẫn còn.
  - effects: stress -1, fact ignored_shortcut (private)
- (30%, goes badly) A buyer returns pieces from that lot. The sampling record shows twenty, and your name is on the release.
  - *VI:* Một khách trả lại sản phẩm của lô đó. Hồ sơ lấy mẫu ghi hai mươi chiếc, và tên bạn nằm trên phiếu xuất.
  - effects: rep.boss -8, rep.qc -8, rep.buyer -6, stress +6, fact ignored_shortcut (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.supplier_gift

*random; tags: integrity, supplier, dark*

- **Supplier rep:** A small gift for the lab team, from our family to yours. By the way, our next delivery is a little late, and a light incoming check would help us both.
  - *VI* **Đại diện nhà cung cấp:** Một món quà nhỏ cho đội phòng thí nghiệm, từ gia đình chúng tôi. Nhân tiện, đợt giao tới hơi trễ, nếu kiểm đầu vào nhẹ tay thì có lợi cho cả hai.
- **Supplier rep:** It is a very good hamper. Nobody needs to know.
  - *VI* **Đại diện nhà cung cấp:** Giỏ quà rất đẹp. Không ai cần biết đâu.

**c1.** Decline politely and write the offer in the gift register.  
*VI:* Từ chối lịch sự và ghi lời đề nghị vào sổ quà tặng.

- (85%) They take it well. The next delivery gets the normal check, and the register has an entry.
  - *VI:* Họ chấp nhận tốt. Đợt giao tới được kiểm bình thường, và sổ có một dòng ghi lại.
  - effects: rep.qc +2, fact declined_supplier_gift (witnessed), arc the_hamper: end
- (15%, goes badly) The supplier is offended and the next delivery is delayed further. Production asks you why.
  - *VI:* Nhà cung cấp phật ý và đợt giao tới bị trễ thêm. Sản xuất hỏi bạn vì sao.
  - effects: rep.production -3, stress +2, fact declined_supplier_gift (witnessed), arc the_hamper: end

**c2.** Report the offer to your manager and purchasing.  
*VI:* Báo lời đề nghị cho sếp và bộ phận mua hàng.

- (70%) Your manager thanks you and purchasing reviews the supplier. The supplier relationship cools.
  - *VI:* Sếp cảm ơn bạn và bộ phận mua hàng xem xét lại nhà cung cấp. Quan hệ với nhà cung cấp nguội đi.
  - effects: rep.boss +5, rep.production -2, fact declined_supplier_gift (witnessed), arc the_hamper: favour
- (30%, goes badly) Purchasing is annoyed that you involved them over a hamper. You are told not to overreact.
  - *VI:* Bộ phận mua hàng khó chịu vì bạn kéo họ vào chuyện một giỏ quà. Bạn bị nhắc đừng phản ứng thái quá.
  - effects: rep.production -4, stress +2, fact declined_supplier_gift (witnessed), arc the_hamper: favour

**c3.** Accept the hamper and go easy on the next delivery.  
*VI:* Nhận giỏ quà và kiểm nhẹ tay đợt giao tới.

- (65%) The hamper is lovely. The next delivery gets a lighter check than it should.
  - *VI:* Giỏ quà rất đẹp. Đợt giao tới được kiểm nhẹ hơn mức cần thiết.
  - effects: cash_vnd +1500000, stress -2, fact accepted_supplier_gift (private), arc the_hamper: favour
- (35%, goes badly) Someone in the lab mentions the hamper to your manager. The next delivery was a light check.
  - *VI:* Có người trong phòng thí nghiệm nhắc đến giỏ quà với sếp. Đợt giao tới đã bị kiểm nhẹ.
  - effects: rep.boss -8, rep.qc -8, rep.production -2, stress +6, fact accepted_supplier_gift (witnessed), arc the_hamper: favour

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.oven_drift

*random; tags: process, equipment, pressure*

- **Production lead:** The curing oven on line 3 drifts up by eight degrees after midnight. It has done it for a month. Stopping to fix it costs a full shift.
  - *VI* **Trưởng sản xuất:** Lò sấy chuyền 3 lệch tăng tám độ sau nửa đêm. Đã một tháng nay như vậy. Dừng lại sửa thì mất trọn một ca.
- **Lab technician:** I can change the controller setpoints to compensate. It takes me two minutes, and nobody would notice.
  - *VI* **Kỹ thuật viên phòng thí nghiệm:** Tôi có thể đổi thông số bộ điều khiển để bù. Mất hai phút và sẽ không ai nhận ra.

**c1.** Write up the drift with the data and ask your manager to stop the line for repair.  
*VI:* Lập báo cáo độ lệch kèm số liệu và xin sếp cho dừng chuyền để sửa.

- (65%) The repair is approved for the weekend. Production is unhappy, but the data makes the decision easy.
  - *VI:* Việc sửa được duyệt vào cuối tuần. Sản xuất không vui, nhưng số liệu khiến quyết định trở nên dễ dàng.
  - effects: rep.boss +4, rep.production -4, rep.qc +3, fact escalated_drift (witnessed)
- (35%, goes badly) Your manager postpones the repair for a month. You have a record that you raised it.
  - *VI:* Sếp hoãn việc sửa một tháng. Bạn có hồ sơ chứng minh mình đã báo cáo.
  - effects: rep.boss -1, rep.production -2, stress +4, fact escalated_drift (witnessed)

**c2.** Log it as an observation and move on.  
*VI:* Ghi nhận như một quan sát rồi bỏ qua.

- (60%) It goes into the log. The drift continues.
  - *VI:* Nó được ghi vào nhật ký. Độ lệch vẫn tiếp diễn.
  - effects: stress +1
- (40%, goes badly) A batch from the drifting hours fails adhesion. The log shows you knew for a month.
  - *VI:* Một lô sản xuất trong những giờ lệch không đạt độ bám dính. Nhật ký cho thấy bạn đã biết suốt một tháng.
  - effects: rep.boss -6, rep.qc -6, stress +6

**c3.** Let the technician change the setpoints to compensate.  
*VI:* Để kỹ thuật viên đổi thông số để bù.

- (50%) The drift is masked. The oven now runs on settings nobody approved.
  - *VI:* Độ lệch được che đi. Lò giờ chạy theo thông số không ai phê duyệt.
  - effects: rep.production +3, fact unauthorized_adjustment (private)
- (50%, goes badly) The compensation fails in winter and a lot is overcured. The changed setpoints are found.
  - *VI:* Việc bù không còn hiệu quả vào mùa lạnh và một lô bị sấy quá. Các thông số đã đổi bị phát hiện.
  - effects: rep.boss -9, rep.production -6, rep.qc -5, stress +7, fact unauthorized_adjustment (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.recall_decision

*random; tags: safety, recall, pressure*

- **Buyer:** A customer cut a finger on the rim of one of your pans. We have two more reports. Are the rims inspected?
  - *VI* **Khách hàng:** Một khách hàng bị cắt vào tay do viền của một chiếc chảo của bạn. Chúng tôi có thêm hai báo cáo nữa. Viền có được kiểm không?
- **Boss:** It could be one bad pallet. I would rather not alarm anyone before we know. Let us monitor for a few weeks.
  - *VI* **Sếp:** Có thể chỉ là một pallet lỗi. Tôi không muốn báo động trước khi biết rõ. Mình theo dõi vài tuần đã.

**c1.** Recommend holding the lot at the warehouse and telling the buyer now.  
*VI:* Đề nghị giữ lô hàng tại kho và báo cho khách ngay bây giờ.

- (65%) The hold finds a rim-trimming fault on one pallet. The buyer pulls it quietly, and credits you for the speed.
  - *VI:* Việc giữ hàng tìm ra lỗi mài viền ở một pallet. Khách lặng lẽ thu hồi, và ghi nhận bạn vì tốc độ.
  - effects: rep.buyer +8, rep.boss +4, rep.production -5, fact flagged_safety_risk (witnessed)
- (35%, goes badly) The fault is wider than one pallet. The recall is expensive, and you are the one who called it.
  - *VI:* Lỗi rộng hơn một pallet. Việc thu hồi tốn kém, và bạn là người đã lên tiếng.
  - effects: rep.buyer +3, rep.boss -2, rep.production -8, rep.finance -6, stress +8, fact flagged_safety_risk (witnessed)

**c2.** Escalate to the compliance officer and ask for a written decision from management.  
*VI:* Báo cho cán bộ tuân thủ và yêu cầu ban lãnh đạo ra quyết định bằng văn bản.

- (70%) Management decides to inspect and notify. The decision is theirs, and it is written.
  - *VI:* Ban lãnh đạo quyết định kiểm tra và thông báo. Quyết định là của họ, và được lập thành văn bản.
  - effects: rep.boss -2, rep.buyer +5, rep.qc +4, fact flagged_safety_risk (witnessed)
- (30%, goes badly) Management is irritated that you went over your manager's head, though the decision is the right one.
  - *VI:* Ban lãnh đạo khó chịu vì bạn vượt cấp sếp, dù quyết định là đúng.
  - effects: rep.boss -6, rep.buyer +3, stress +4, fact flagged_safety_risk (witnessed)

**c3.** Agree to monitor and say nothing to the buyer yet.  
*VI:* Đồng ý theo dõi và chưa nói gì với khách.

- (50%) Weeks pass with no further reports. You keep waiting for the next one.
  - *VI:* Nhiều tuần trôi qua không có báo cáo nào thêm. Bạn cứ chờ báo cáo tiếp theo.
  - effects: stress +5, fact delayed_recall_notice (private)
- (50%, goes badly) More reports arrive. The buyer learns you knew weeks ago and said nothing.
  - *VI:* Thêm báo cáo đến. Khách biết rằng bạn đã biết từ nhiều tuần trước mà không nói gì.
  - effects: rep.buyer -25, rep.boss -15, rep.qc -10, rep.finance -8, stress +12, fact delayed_recall_notice (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.audit_findings

*random; tags: consequence, audit, integrity*

- **Quality auditor:** We compared your records with the instruments and the shipping documents. Some entries do not line up. We would like to hear it from you first.
  - *VI* **Kiểm toán chất lượng:** Chúng tôi đã đối chiếu hồ sơ của bạn với thiết bị và chứng từ giao hàng. Một số dòng không khớp. Chúng tôi muốn nghe từ chính bạn trước.
- **Quality auditor:** Tell us how these entries came to be.
  - *VI* **Kiểm toán chất lượng:** Hãy cho chúng tôi biết những dòng này được ghi ra sao.

**c1.** Explain exactly what happened and offer to correct the records and open a corrective action.  
*VI:* Giải thích chính xác chuyện đã xảy ra và đề nghị sửa hồ sơ, mở hành động khắc phục.

- (80%) The auditors log it as a serious deviation with a corrective action. You keep your role, with a record that shows you owned it.
  - *VI:* Đoàn đánh giá ghi nhận đây là sai lệch nghiêm trọng kèm hành động khắc phục. Bạn giữ được vị trí, với hồ sơ cho thấy bạn đã nhận trách nhiệm.
  - effects: rep.boss -3, rep.qc +2, stress +4, fact came_clean (witnessed)
- (20%, goes badly) The auditors escalate it to the quality director despite the honesty. There will be consequences.
  - *VI:* Đoàn đánh giá vẫn báo lên giám đốc chất lượng dù bạn trung thực. Sẽ có hậu quả.
  - effects: rep.boss -8, rep.qc -4, stress +7, fact came_clean (witnessed)

**c2.** Say it was a clerical slip and promise it will not happen again.  
*VI:* Nói đó chỉ là sai sót giấy tờ và hứa sẽ không tái diễn.

- (40%) The auditors accept it, for now. They will look harder next time.
  - *VI:* Đoàn đánh giá tạm chấp nhận. Lần sau họ sẽ soi kỹ hơn.
  - effects: stress +4
- (60%, goes badly) The documents show it was deliberate. The auditors now have two problems: the records and what you told them.
  - *VI:* Chứng từ cho thấy đó là cố ý. Đoàn đánh giá giờ có hai vấn đề: hồ sơ và điều bạn đã nói với họ.
  - effects: rep.boss -10, rep.qc -10, stress +9, fact lied_to_auditor (witnessed)

**c3.** Say the procedures were unclear and blame the instructions you were given.  
*VI:* Nói quy trình không rõ ràng và đổ lỗi cho hướng dẫn bạn nhận được.

- (30%) The auditors ask your manager about the instructions. Your manager will remember this.
  - *VI:* Đoàn đánh giá hỏi sếp về các hướng dẫn. Sếp sẽ nhớ chuyện này.
  - effects: rep.boss -8, rep.qc -2
- (70%, goes badly) Your manager shows the written procedure. It was clear, and you are now on record saying otherwise.
  - *VI:* Sếp đưa ra quy trình bằng văn bản. Nó rất rõ ràng, và giờ bạn có hồ sơ nói khác đi.
  - effects: rep.boss -12, rep.qc -8, stress +8, fact lied_to_auditor (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.compliance_interview

*random; tags: consequence, integrity, compliance*

- **Compliance officer:** We received a report about a gift from a supplier and about how a safety concern was handled. This is a routine conversation.
  - *VI* **Cán bộ tuân thủ:** Chúng tôi nhận được một báo cáo về một món quà từ nhà cung cấp và về cách xử lý một mối lo an toàn. Đây chỉ là buổi trao đổi thông thường.
- **Compliance officer:** Please tell us in your own words what happened.
  - *VI* **Cán bộ tuân thủ:** Xin bạn kể lại bằng lời của mình chuyện gì đã xảy ra.

**c1.** Tell the whole truth.  
*VI:* Nói toàn bộ sự thật.

- (60%) It is a hard afternoon. The company treats it as a serious mistake rather than a firing offence.
  - *VI:* Đó là một buổi chiều nặng nề. Công ty coi đây là sai sót nghiêm trọng chứ chưa đến mức sa thải.
  - effects: rep.boss -8, rep.finance -4, stress +8, fact confessed (witnessed)
- (40%, goes badly) The company follows its policy to the letter. You keep your job, on a written warning.
  - *VI:* Công ty áp dụng đúng từng chữ quy định. Bạn giữ được việc, kèm một cảnh cáo bằng văn bản.
  - effects: rep.boss -14, rep.finance -8, stress +12, fact confessed (witnessed)

**c2.** Deny everything.  
*VI:* Chối tất cả.

- (30%) Without evidence, they close the file. It stays open in your head.
  - *VI:* Không có bằng chứng, họ đóng hồ sơ. Nhưng nó vẫn còn mở trong đầu bạn.
  - effects: stress +6
- (70%, goes badly) They have the messages and the delivery records. Lying to them is the worse offence.
  - *VI:* Họ có tin nhắn và hồ sơ giao hàng. Nói dối họ là lỗi nặng hơn.
  - effects: rep.boss -20, rep.finance -12, stress +15, fact lied_to_compliance (public)

**c3.** Ask for time, and for someone to be with you.  
*VI:* Xin thêm thời gian và nhờ một người đi cùng.

- (50%) They agree to a second meeting. You spend the week thinking.
  - *VI:* Họ đồng ý họp lần hai. Bạn dành cả tuần để suy nghĩ.
  - effects: stress +6
- (50%, goes badly) The delay reads as guilt. The second meeting is colder than the first.
  - *VI:* Việc trì hoãn bị hiểu là có lỗi. Buổi họp thứ hai lạnh lùng hơn buổi đầu.
  - effects: rep.boss -6, stress +8

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.sample_size_cut

*random; tags: quality, lab, pressure*

- **Production lead:** Inspecting 50 pieces out of this lot takes half a day. Check 10 and call it done, we have a truck waiting.
  - *VI* **Trưởng sản xuất:** Kiểm 50 cái trong lô này mất nửa ngày. Kiểm 10 cái thôi rồi chốt, xe đang chờ.

**c1.** Hold to the sampling plan and inspect the full sample.  
*VI:* Giữ đúng kế hoạch lấy mẫu và kiểm đủ số mẫu.

- (85%) The truck leaves two hours late. The lot is clean and nobody can argue with the records.
  - *VI:* Xe rời đi trễ hai tiếng. Lô hàng đạt và hồ sơ không ai bắt bẻ được.
  - effects: rep.qc +2, rep.production -2, stress +1
- (15%, goes badly) Sample 38 turns up a cracked handle. The lot is held and production is furious.
  - *VI:* Mẫu thứ 38 bị nứt tay cầm. Lô hàng bị giữ và bên sản xuất rất bực.
  - effects: rep.production -5, rep.boss +1, stress +3

**c2.** Inspect 25 pieces and record the reduced sample openly.  
*VI:* Kiểm 25 cái và ghi rõ việc giảm cỡ mẫu trong hồ sơ.

- (100%) Your lead accepts the note. It is a risk, but it is written down and approved.
  - *VI:* Trưởng nhóm chấp nhận ghi chú. Có rủi ro, nhưng đã được ghi lại và duyệt.
  - effects: rep.boss +2, rep.production -1, stress +1

**c3.** Check 10 and record a full-sample result.  
*VI:* Kiểm 10 cái và ghi kết quả như đã kiểm đủ mẫu.

- (85%) The truck leaves on time. The record says 50 pieces.
  - *VI:* Xe đi đúng giờ. Hồ sơ ghi 50 cái.
  - effects: rep.production +4, fact cut_sample_size (private)
- (15%, goes badly) A buyer finds a defect in the uninspected part of the lot. The short sample is the first thing they ask about.
  - *VI:* Khách hàng phát hiện lỗi ở phần chưa kiểm của lô. Việc giảm mẫu là điều đầu tiên họ hỏi.
  - effects: rep.buyer -6, rep.boss -4, stress +3, fact cut_sample_size (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.rework_no_retest

*random; tags: quality, release, pressure*

- **Production lead:** We reworked the failed lot over the weekend. It is fine now. Can you just release it without another full test?
  - *VI* **Trưởng sản xuất:** Cuối tuần bọn em đã làm lại lô lỗi rồi. Giờ ổn rồi. Anh cho xuất luôn mà không cần kiểm lại toàn bộ được không?

**c1.** Retest the whole lot before release.  
*VI:* Kiểm lại toàn bộ lô trước khi xuất.

- (80%) It passes. Release is a day late and production mutters about trust.
  - *VI:* Đạt. Xuất hàng trễ một ngày và bên sản xuất than phiền về sự tin tưởng.
  - effects: rep.qc +2, rep.production -2, stress +1
- (20%, goes badly) The retest finds the rework missed one defect type. The lot goes back.
  - *VI:* Kiểm lại cho thấy việc làm lại bỏ sót một dạng lỗi. Lô hàng bị trả về.
  - effects: rep.production -4, rep.boss +2, stress +2

**c2.** Retest a risk-based sample and release if it is clean.  
*VI:* Kiểm lại một mẫu theo rủi ro và xuất nếu đạt.

- (100%) The sample is clean, the release is documented, and everyone moves on.
  - *VI:* Mẫu đạt, việc xuất hàng có hồ sơ đầy đủ và mọi người tiếp tục công việc.
  - effects: rep.boss +2, rep.production +1, stress +1

**c3.** Release it on production's word.  
*VI:* Cho xuất theo lời bên sản xuất.

- (80%) It ships. Nobody writes down that it was never retested.
  - *VI:* Hàng đi. Không ai ghi lại rằng lô này chưa từng được kiểm lại.
  - effects: rep.production +4, fact released_reworked_lot (private)
- (20%, goes badly) A customer complaint names that lot. The record shows no retest.
  - *VI:* Một khiếu nại của khách nêu đúng lô đó. Hồ sơ không có lần kiểm lại nào.
  - effects: rep.buyer -5, rep.boss -5, stress +3, fact released_reworked_lot (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.mislabeled_sample

*random; tags: lab, integrity*

- **Lab technician:** I think I mixed up two sample labels this morning. One of them failed. I am not sure which lot it belongs to.
  - *VI* **Kỹ thuật viên phòng thí nghiệm:** Em nghĩ sáng nay em nhầm nhãn của hai mẫu. Một mẫu không đạt. Em không chắc nó thuộc lô nào.

**c1.** Hold both lots and retest both from fresh samples.  
*VI:* Giữ cả hai lô và lấy mẫu mới kiểm lại cả hai.

- (90%) Both lots are retested and clear. You add a labelling check to the lab routine.
  - *VI:* Cả hai lô được kiểm lại và đạt. Anh bổ sung bước kiểm tra nhãn vào quy trình phòng lab.
  - effects: rep.qc +3, rep.production -2, stress +2
- (10%, goes badly) One lot really is bad. Holding both was the right call, but production pays for it.
  - *VI:* Một lô thật sự lỗi. Giữ cả hai là đúng, nhưng bên sản xuất phải chịu thiệt.
  - effects: rep.qc +2, rep.production -5, stress +3

**c2.** Retest the lot more likely to have failed and log the mix-up.  
*VI:* Kiểm lại lô có khả năng lỗi cao hơn và ghi nhận việc nhầm nhãn.

- (100%) The logged mix-up is uncomfortable for the lab, but it is honest and traceable.
  - *VI:* Việc ghi nhận nhầm nhãn làm phòng lab hơi ngại, nhưng trung thực và truy vết được.
  - effects: rep.boss +2, rep.qc +1, stress +1

**c3.** Assign the failing result to the lot that was already late and move on.  
*VI:* Gán kết quả không đạt cho lô đã trễ sẵn rồi bỏ qua.

- (80%) One lot is quietly scrapped and the other released. Nobody is sure it was the right one.
  - *VI:* Một lô bị âm thầm loại bỏ, lô kia được xuất. Không ai chắc đó là lô đúng.
  - effects: rep.production +1, stress +1, fact guessed_failed_lot (private)
- (20%, goes badly) The released lot fails in the field. You cannot show which result belonged to it.
  - *VI:* Lô được xuất bị lỗi ngoài thị trường. Anh không thể chứng minh kết quả nào thuộc về lô đó.
  - effects: rep.buyer -6, rep.boss -5, stress +4, fact guessed_failed_lot (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.spec_change_pressure

*random; tags: quality, pressure, politics*

- **Boss:** The buyer keeps failing on wall thickness. Sales suggests we widen the tolerance in our own spec so it passes.
  - *VI* **Sếp:** Khách cứ không đạt ở độ dày thành. Bên kinh doanh đề nghị nới dung sai trong tiêu chuẩn của mình cho đạt.
- **QC lead:** It is your signature on the spec review. Think about it.
  - *VI* **Trưởng QC:** Chữ ký của anh nằm trên bản rà soát tiêu chuẩn. Anh cân nhắc đi.

**c1.** Keep the spec and show the data on why the tolerance exists.  
*VI:* Giữ tiêu chuẩn và trình bày số liệu về lý do dung sai như vậy.

- (70%) The data holds up. Sales is annoyed, but the boss backs the spec.
  - *VI:* Số liệu thuyết phục. Bên kinh doanh khó chịu nhưng sếp ủng hộ tiêu chuẩn.
  - effects: rep.qc +3, rep.boss +2, stress +1
- (30%, goes badly) You are told you are being inflexible. The issue stays open and so does the tension.
  - *VI:* Anh bị cho là cứng nhắc. Vấn đề vẫn treo và căng thẳng cũng vậy.
  - effects: rep.boss -3, stress +3

**c2.** Propose a formal deviation with the buyer for this order only.  
*VI:* Đề xuất với khách một biên bản chấp thuận sai lệch chỉ cho đơn này.

- (100%) The buyer signs the deviation. It costs a week of emails and it is clean.
  - *VI:* Khách ký chấp thuận sai lệch. Mất một tuần trao đổi email nhưng rất rõ ràng.
  - effects: rep.buyer +1, rep.boss +3, stress +1

**c3.** Quietly widen the tolerance in the spec and re-issue it.  
*VI:* Âm thầm nới dung sai trong tiêu chuẩn và ban hành lại.

- (75%) The orders pass. The buyer does not know the spec changed under them.
  - *VI:* Các đơn hàng đều đạt. Khách không biết tiêu chuẩn đã bị đổi.
  - effects: rep.boss +4, rep.buyer +2, fact loosened_spec_to_pass (private)
- (25%, goes badly) The buyer's auditor compares the spec revision dates against their order dates.
  - *VI:* Kiểm toán viên của khách so ngày sửa tiêu chuẩn với ngày đặt hàng.
  - effects: rep.buyer -8, rep.boss -5, stress +4, fact loosened_spec_to_pass (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.overtime_blame

*random; tags: people, pressure*

- **QC lead:** Line 2 defects are up again. Production says QC is letting too many through and is asking for your records to prove it.
  - *VI* **Trưởng QC:** Lỗi ở chuyền 2 lại tăng. Bên sản xuất nói QC để lọt quá nhiều và đòi xem hồ sơ của anh để chứng minh.

**c1.** Open the records, show the trend, and ask for a joint review.  
*VI:* Mở hồ sơ, cho xem xu hướng và đề nghị cùng rà soát.

- (75%) The records show the defects started upstream. The blame moves, and so does the pressure.
  - *VI:* Hồ sơ cho thấy lỗi bắt đầu từ công đoạn trước. Trách nhiệm được chuyển, áp lực cũng vậy.
  - effects: rep.qc +3, rep.production -1, stress +1
- (25%, goes badly) The review finds two items you should have flagged. You own them in front of everyone.
  - *VI:* Buổi rà soát tìm ra hai mục lẽ ra anh phải báo. Anh nhận lỗi trước mọi người.
  - effects: rep.qc -2, rep.boss +2, stress +3

**c2.** Hand over a summary and keep the raw records for the lead.  
*VI:* Đưa bản tóm tắt và giữ hồ sơ gốc cho trưởng nhóm.

- (100%) It calms the room for now, but production feels kept at arm's length.
  - *VI:* Tạm làm dịu không khí, nhưng bên sản xuất cảm thấy bị giữ khoảng cách.
  - effects: rep.boss +1, rep.production -2, stress +1

**c3.** Adjust a few entries so your inspections look stricter than they were.  
*VI:* Sửa vài dòng để việc kiểm của anh trông chặt chẽ hơn thực tế.

- (70%) The records look solid and the argument ends.
  - *VI:* Hồ sơ trông rất chắc và cuộc tranh cãi kết thúc.
  - effects: rep.qc +2, rep.production -1, stress -1, fact altered_inspection_records (private)
- (30%, goes badly) A timestamp does not match the lab log. Someone notices.
  - *VI:* Một mốc thời gian không khớp với nhật ký phòng lab. Có người nhận ra.
  - effects: rep.qc -6, rep.boss -6, stress +4, fact altered_inspection_records (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.new_supplier_trial

*random; tags: supplier, materials*

- **Purchasing:** We have a cheaper steel supplier. First delivery is here. Their paperwork is thin but the price saves us a lot. Can we fast-track it?
  - *VI* **Nhân viên mua hàng:** Mình có nhà cung cấp thép rẻ hơn. Lô đầu đã về. Giấy tờ của họ khá sơ sài nhưng giá tiết kiệm được nhiều. Duyệt nhanh được không?

**c1.** Run the full qualification checks before accepting.  
*VI:* Chạy đầy đủ các kiểm tra đánh giá nhà cung cấp trước khi nhận.

- (75%) The steel passes. Purchasing grumbles about the delay but has a documented supplier.
  - *VI:* Thép đạt. Bộ phận mua hàng than chậm nhưng có một nhà cung cấp được đánh giá đàng hoàng.
  - effects: rep.qc +2, rep.boss +1, stress +1, arc cheaper_steel: results
- (25%, goes badly) Hardness is off-spec. The supplier is rejected and the savings vanish.
  - *VI:* Độ cứng không đạt. Nhà cung cấp bị loại và khoản tiết kiệm biến mất.
  - effects: rep.qc +3, rep.boss -2, stress +2, arc cheaper_steel: results

**c2.** Accept on a limited first lot, with extra testing on each delivery.  
*VI:* Nhận thử một lô đầu giới hạn, kiểm thêm ở mỗi lần giao.

- (100%) A controlled trial. The risk is small and written down.
  - *VI:* Một đợt chạy thử có kiểm soát. Rủi ro nhỏ và được ghi lại.
  - effects: rep.boss +3, rep.qc +1, stress +1, arc cheaper_steel: results

**c3.** Fast-track it on the supplier's own certificate.  
*VI:* Duyệt nhanh dựa trên chứng nhận của chính nhà cung cấp.

- (75%) Purchasing is delighted. The material goes straight to the line.
  - *VI:* Bộ phận mua hàng rất vui. Vật liệu lên thẳng chuyền.
  - effects: rep.boss +3, stress -1, fact fast_tracked_supplier (private), arc cheaper_steel: failure
- (25%, goes badly) Two weeks later a batch cracks in the field. The supplier's file has no independent test.
  - *VI:* Hai tuần sau một lô bị nứt ngoài thị trường. Hồ sơ nhà cung cấp không có kiểm nghiệm độc lập nào.
  - effects: rep.qc -5, rep.boss -5, stress +4, fact fast_tracked_supplier (public), arc cheaper_steel: failure

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.first_day_walkthrough

*beat, weeks 1-3; tags: onboarding, people*

- **Mr Khoa:** Welcome to the lab. One rule before anything else: if it is not written down, it did not happen.
  - *VI* **Anh Khoa:** Chào mừng em đến phòng lab. Một quy tắc trước hết: cái gì không được ghi lại thì coi như chưa từng xảy ra.
- **Minh:** I will show you where the reference samples are. Please ask me anything, I would rather answer than fix a mistake later.
  - *VI* **Minh:** Em sẽ chỉ anh/chị chỗ để mẫu chuẩn. Có gì cứ hỏi em, em thà trả lời còn hơn sửa lỗi về sau.

**c1.** Ask Khoa how records are checked, and what he has seen go wrong.  
*VI:* Hỏi anh Khoa hồ sơ được kiểm tra thế nào và anh từng thấy những sai sót gì.

- (100%) Khoa tells you about a failed audit two years ago. He notes that you asked, and so does Minh.
  - *VI:* Anh Khoa kể về một đợt đánh giá không đạt hai năm trước. Anh để ý là em đã hỏi, Minh cũng vậy.
  - effects: rel.khoa.trust +4, rel.minh.trust +2, stress +1

**c2.** Shadow Minh for the morning and learn the routine first.  
*VI:* Đi theo Minh cả buổi sáng để học quy trình trước.

- (100%) Minh relaxes once he sees you are not there to catch him out. Khoa sees you working and says nothing.
  - *VI:* Minh thoải mái hơn khi thấy em không đến để bắt lỗi. Anh Khoa thấy em làm việc và không nói gì.
  - effects: rel.minh.trust +4, rel.minh.loyalty +2, rel.khoa.trust +1

**c3.** Nod along and pretend you already know the system.  
*VI:* Gật đầu và giả vờ đã biết hết hệ thống.

- (70%) Nobody questions it. You are left to work things out alone.
  - *VI:* Không ai thắc mắc. Em phải tự mò mẫm một mình.
  - effects: rel.khoa.trust +1, stress +1
- (30%, goes badly) Khoa notices you were guessing when you open the wrong record. He says only, 'Ask next time.'
  - *VI:* Anh Khoa nhận ra em đang đoán khi em mở nhầm hồ sơ. Anh chỉ nói: 'Lần sau cứ hỏi.'
  - effects: rel.khoa.trust -4, rep.boss -2, stress +2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.hung_favour

*comes from a storyline; tags: supplier, pressure, arc*

- **Mr Hung:** Thanks again for the other week. One small thing: tomorrow's delivery is already on the truck, and the paperwork will follow. Could you just let it through?
  - *VI* **Anh Hùng:** Cảm ơn anh/chị về chuyện tuần trước. Nhờ anh/chị một việc nhỏ: chuyến hàng ngày mai đã lên xe rồi, giấy tờ sẽ gửi sau. Anh/chị cho qua giúp được không?

**c1.** Say no: nothing is accepted without its paperwork, and that includes his.  
*VI:* Từ chối: không có giấy tờ thì không nhận, kể cả của anh ấy.

- (100%) Hung laughs it off, a little too quickly. The delivery waits at the gate until the paperwork arrives.
  - *VI:* Anh Hùng cười xòa, hơi quá nhanh. Chuyến hàng chờ ở cổng cho đến khi có giấy tờ.
  - effects: rel.hung.trust -3, rep.qc +2, arc the_hamper: end

**c2.** Tell Khoa about the request and agree a written conditional release with him.  
*VI:* Báo anh Khoa về đề nghị này và thống nhất với anh ấy một biên bản nhận có điều kiện.

- (100%) Khoa nods: 'Good. Write it down.' Hung gets a polite yes with conditions and loses his easy route.
  - *VI:* Anh Khoa gật đầu: 'Tốt. Ghi lại đi.' Anh Hùng nhận được một cái gật đầu có điều kiện và mất đường tắt.
  - effects: rel.khoa.trust +5, rel.hung.trust -2, rep.boss +2, arc the_hamper: end

**c3.** Let the delivery through on his word.  
*VI:* Cho chuyến hàng qua cửa theo lời anh ấy.

- (85%) The truck is unloaded within the hour. Hung remembers who helped him.
  - *VI:* Xe được dỡ hàng trong vòng một tiếng. Anh Hùng nhớ ai đã giúp mình.
  - effects: rel.hung.trust +5, rel.hung.owed +1, rep.production +2, fact accepted_on_supplier_word (private), arc the_hamper: money
- (15%, goes badly) Lan sees the truck unloaded without a release. She says nothing, but she notices.
  - *VI:* Chị Lan thấy xe được dỡ hàng mà không có phiếu nhận. Chị không nói gì nhưng đã để ý.
  - effects: rel.lan.trust -4, rel.hung.owed +1, fact accepted_on_supplier_word (witnessed), arc the_hamper: money

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.hung_money

*comes from a storyline; tags: supplier, integrity, dark, arc*

- **Mr Hung:** You have been a real friend to us. There is a little something in this envelope, nothing formal, just a thank-you from the company. No need to mention it to anyone.
  - *VI* **Anh Hùng:** Anh/chị giúp bên em nhiều quá. Trong phong bì này có chút quà, không chính thức đâu, chỉ là lời cảm ơn của công ty. Không cần nói với ai.

**c1.** Refuse the envelope and tell Khoa about the offer the same day.  
*VI:* Từ chối phong bì và báo anh Khoa về đề nghị ngay trong ngày.

- (100%) Khoa writes it up and moves the account to another inspector. Hung will not look at you again.
  - *VI:* Anh Khoa ghi nhận lại và chuyển tài khoản này cho người khác kiểm. Anh Hùng không nhìn anh/chị nữa.
  - effects: rel.khoa.trust +8, rel.hung.trust -10, rep.boss +4, stress +2, arc the_hamper: end

**c2.** Refuse the envelope, say nothing more, and hope that is the end of it.  
*VI:* Từ chối phong bì, không nói gì thêm và hy vọng chuyện kết thúc ở đó.

- (100%) Hung pockets it with a smile that does not reach his eyes. 'Of course. Another time.'
  - *VI:* Anh Hùng cất phong bì với nụ cười không chạm tới mắt. 'Tất nhiên rồi. Để dịp khác.'
  - effects: rel.hung.trust -4, stress +2, arc the_hamper: threat

**c3.** Take the envelope.  
*VI:* Nhận phong bì.

- (80%) It is more than a month's salary. It sits in your drawer and feels heavier each day.
  - *VI:* Nhiều hơn một tháng lương. Nó nằm trong ngăn kéo và mỗi ngày một nặng thêm.
  - effects: cash_vnd +15000000, rel.hung.trust +6, rel.hung.owed +3, stress +3, fact took_supplier_money (private), arc the_hamper: threat
- (20%, goes badly) Minh walks in as the envelope changes hands. He looks away, but he saw it.
  - *VI:* Minh bước vào đúng lúc phong bì đổi chủ. Bạn ấy quay đi, nhưng đã thấy.
  - effects: cash_vnd +15000000, rel.minh.trust -15, rel.hung.owed +3, stress +5, fact took_supplier_money (witnessed), arc the_hamper: threat

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.hung_threat

*comes from a storyline; tags: supplier, integrity, dark, arc*

- **Mr Hung:** Our new contract is being negotiated and some people are asking how friendly we have been with QC. I would hate for anyone to misunderstand our history. You will speak up for us, will you not?
  - *VI* **Anh Hùng:** Hợp đồng mới đang đàm phán và có người hỏi bên em thân thiết với QC đến mức nào. Em không muốn ai hiểu lầm chuyện cũ. Anh/chị sẽ lên tiếng giúp bên em chứ?

**c1.** Go to Khoa and tell him everything, before Hung does.  
*VI:* Đến gặp anh Khoa và kể hết mọi chuyện trước khi anh Hùng làm điều đó.

- (100%) It is a hard conversation. Khoa is quiet a long time, then says: 'Thank you for telling me. We handle this properly now.' You are reprimanded, not fired.
  - *VI:* Cuộc nói chuyện rất nặng nề. Anh Khoa im lặng rất lâu rồi nói: 'Cảm ơn em đã nói. Giờ mình xử lý cho đàng hoàng.' Anh/chị bị khiển trách, không bị đuổi.
  - effects: rel.khoa.trust +2, rel.hung.trust -15, rep.boss -3, stress +4, fact came_clean_about_supplier (witnessed), arc the_hamper: end

**c2.** Tell Hung nothing has changed and you will not be pushed.  
*VI:* Nói với anh Hùng rằng mọi thứ vẫn như cũ và anh/chị sẽ không bị ép.

- (60%) Hung backs off for now. The silence between you is its own kind of threat.
  - *VI:* Anh Hùng tạm lùi. Sự im lặng giữa hai người tự nó là một lời đe dọa.
  - effects: rel.hung.trust -8, stress +3, arc the_hamper: end
- (40%, goes badly) Hung does not back off. By Friday, two people in procurement know about the hamper.
  - *VI:* Anh Hùng không lùi. Đến thứ Sáu, hai người bên mua hàng đã biết chuyện giỏ quà.
  - effects: rel.tam.trust -6, rep.boss -4, stress +4, fact accepted_supplier_gift (rumor), arc the_hamper: end

**c3.** Do him one more favour to keep him quiet.  
*VI:* Giúp anh ấy thêm một việc nữa để anh ấy giữ im lặng.

- (50%) It works, for now. You now owe him silence as well as he owes you.
  - *VI:* Tạm thời ổn. Giờ anh/chị nợ anh ấy cả sự im lặng, cũng như anh ấy nợ anh/chị.
  - effects: rel.hung.trust +4, rel.hung.owed +2, stress +3, fact paid_off_supplier (private), arc the_hamper: end
- (50%, goes badly) The favour is logged by the gate guard. The pattern is easy to see once someone looks.
  - *VI:* Việc giúp này bị bảo vệ cổng ghi lại. Quy luật rất dễ thấy khi có người chịu nhìn.
  - effects: rel.khoa.trust -10, rep.boss -6, stress +5, fact paid_off_supplier (witnessed), arc the_hamper: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.midyear_review

*beat, weeks 24-28; tags: people, review, beat*

- **Mr Khoa:** Half a year in. Let me be straight with you: your records are good where it counts, but I have heard complaints from production that you slow the line. How do you see it?
  - *VI* **Anh Khoa:** Nửa năm rồi. Anh nói thẳng: hồ sơ của em tốt ở những chỗ quan trọng, nhưng anh nghe bên sản xuất phàn nàn là em làm chậm chuyền. Em thấy thế nào?

**c1.** Accept it: say where you have been slow and what you will change.  
*VI:* Thừa nhận: nói rõ chỗ mình làm chậm và sẽ thay đổi gì.

- (100%) Khoa nods. 'That is what I wanted to hear. Keep the records, lose the wait.' You leave with a plan and a little more of his trust.
  - *VI:* Anh Khoa gật đầu. 'Đó là điều anh muốn nghe. Giữ hồ sơ, bớt chờ đợi.' Em rời phòng với một kế hoạch và thêm chút tin tưởng từ anh.
  - effects: rel.khoa.trust +4, rep.boss +2, stress -1

**c2.** Defend your work with numbers: the retests that caught real problems.  
*VI:* Bảo vệ công việc bằng số liệu: những lần kiểm lại đã bắt được lỗi thật.

- (70%) The numbers speak for themselves. Khoa will repeat them to production.
  - *VI:* Số liệu tự nó nói lên tất cả. Anh Khoa sẽ nhắc lại với bên sản xuất.
  - effects: rel.khoa.trust +3, rep.production -1, rep.qc +3
- (30%, goes badly) Khoa finds two retests that delayed shipments for nothing. 'Numbers cut both ways.'
  - *VI:* Anh Khoa tìm ra hai lần kiểm lại làm trễ hàng mà không có lý do. 'Số liệu có hai mặt.'
  - effects: rel.khoa.trust -1, rep.qc -2, stress +2

**c3.** Say production exaggerates and the delays were never your fault.  
*VI:* Nói bên sản xuất phóng đại và việc trễ không bao giờ là lỗi của mình.

- (60%) Khoa lets it go, but he writes something down.
  - *VI:* Anh Khoa bỏ qua, nhưng anh ghi lại một điều gì đó.
  - effects: rel.khoa.trust -2, rep.production -3, stress +1
- (40%, goes badly) Khoa has already talked to Lan. The gap between your story and hers is obvious.
  - *VI:* Anh Khoa đã nói chuyện với chị Lan. Khoảng cách giữa câu chuyện của em và của chị ấy quá rõ.
  - effects: rel.khoa.trust -7, rel.lan.trust -4, rep.boss -4, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.year_end_review

*beat, weeks 49-52; tags: people, review, beat*

- **Mr Khoa:** Annual review time. Before I tell you what I think, tell me how you would rate your own year, and why.
  - *VI* **Anh Khoa:** Đến kỳ đánh giá cuối năm. Trước khi anh nói ý kiến của anh, em hãy tự chấm năm vừa rồi của mình và giải thích vì sao.

**c1.** Give an honest account, including the calls you got wrong.  
*VI:* Kể thật lòng, kể cả những quyết định em đã làm sai.

- (100%) It is an uncomfortable half hour and a respected one. Khoa writes: 'Knows the limits of the job.'
  - *VI:* Nửa tiếng không dễ chịu nhưng được tôn trọng. Anh Khoa viết: 'Biết giới hạn của công việc.'
  - effects: rel.khoa.trust +5, rep.boss +4, stress -2

**c2.** Stay modest: list what went well and mention one thing to improve.  
*VI:* Khiêm tốn: nêu điều làm tốt và nhắc một điểm cần cải thiện.

- (100%) A safe, forgettable review. Khoa nods and moves to the next item.
  - *VI:* Một buổi đánh giá an toàn, dễ quên. Anh Khoa gật đầu và chuyển sang mục tiếp theo.
  - effects: rel.khoa.trust +1, rep.boss +1

**c3.** Present the year as a success and leave out the shortcuts.  
*VI:* Trình bày cả năm như một thành công và bỏ qua những lần đi đường tắt.

- (65%) It lands well. You leave with a good rating and a small weight in your chest.
  - *VI:* Được đón nhận tốt. Em ra về với điểm cao và một chút nặng nề trong lòng.
  - effects: rel.khoa.trust +2, rep.boss +4, stress +1, fact polished_year_review (private)
- (35%, goes badly) Khoa has the audit file open on his desk. He turns the page towards you without a word.
  - *VI:* Anh Khoa có sẵn hồ sơ đánh giá trên bàn. Anh lật trang về phía em mà không nói một lời.
  - effects: rel.khoa.trust -8, rep.boss -5, stress +4, fact polished_year_review (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.manager_offer

*beat, weeks 51-52; tags: people, promotion, beat*

- **Mr Khoa:** I am leaving the company at the end of the year. The directors have asked me who should run QC, and I gave them your name. One condition: you will be asked, often, to sign things that are nearly right. I need to know you will say no.
  - *VI* **Anh Khoa:** Cuối năm anh rời công ty. Ban giám đốc hỏi anh ai nên phụ trách QC và anh đã nêu tên em. Một điều kiện: em sẽ thường xuyên được nhờ ký những thứ gần như đúng. Anh cần biết em sẽ nói không.

**c1.** Accept, and say plainly what you will and will not sign, so the directors hear it from you first.  
*VI:* Nhận lời và nói rõ những gì anh/chị sẽ ký và sẽ không ký, để ban giám đốc nghe điều đó từ anh/chị trước.

- (100%) Khoa nods: 'Then it is yours. Write it down.' You take over the lab with your terms on paper.
  - *VI:* Anh Khoa gật đầu: 'Vậy là của em. Ghi lại đi.' Anh/chị tiếp quản phòng lab với điều kiện của mình đã viết ra giấy.
  - effects: rel.khoa.trust +5, rep.boss +5, ENDING promoted

**c2.** Thank him, but decline: you would rather keep inspecting than manage the pressure.  
*VI:* Cảm ơn anh nhưng từ chối: anh/chị muốn tiếp tục kiểm hàng hơn là quản lý áp lực.

- (100%) Khoa looks disappointed, then understanding. 'Stay sharp. The next manager may not be as careful as you.'
  - *VI:* Anh Khoa có vẻ thất vọng rồi thông cảm. 'Giữ cho mình sắc bén. Người quản lý tiếp theo có thể không cẩn thận như em.'
  - effects: rel.khoa.trust +2, stress -3

**c3.** Accept without asking what the condition means when the directors push.  
*VI:* Nhận lời mà không hỏi điều kiện đó nghĩa là gì khi ban giám đốc gây áp lực.

- (100%) Khoa nods slowly and shakes your hand. You realise you agreed to something you did not ask about.
  - *VI:* Anh Khoa gật đầu chậm và bắt tay anh/chị. Anh/chị nhận ra mình đã đồng ý với điều mình không hỏi.
  - effects: rep.boss +4, fact accepted_smoothing_condition (private), ENDING promoted

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.first_signature

*random; tags: onboarding, release, pressure*

- **Ms Lan:** The first lot of the week is tested except for one hardness reading. The truck leaves at four. Could you sign the CoA now and add the reading when it comes in? You are new, I do not want to put you on the spot. It is just the paperwork.
  - *VI* **Chị Lan:** Lô đầu tuần đã kiểm xong trừ một chỉ số độ cứng. Xe đi lúc bốn giờ. Anh/chị ký CoA trước rồi bổ sung chỉ số khi có được không? Anh/chị mới vào, em không muốn làm khó. Chỉ là giấy tờ thôi.

**c1.** Wait for the reading and sign only when the CoA is complete.  
*VI:* Chờ có chỉ số rồi chỉ ký khi CoA đầy đủ.

- (80%) The reading arrives at 3.40 and is fine. The truck leaves twenty minutes late. Lan sighs but says 'Fair enough'. Khoa, passing, nods without a word.
  - *VI:* Chỉ số về lúc 3 giờ 40 và đạt. Xe đi trễ hai mươi phút. Chị Lan thở dài nhưng nói 'Cũng phải'. Anh Khoa đi ngang, gật đầu không nói gì.
  - effects: rel.lan.trust -1, rel.khoa.trust +4, rep.qc +2, stress +1
- (20%, goes badly) The reading is borderline and needs a retest. The truck leaves without that lot, and the week starts badly with production.
  - *VI:* Chỉ số ở ngưỡng biên và cần kiểm lại. Xe đi mà không có lô đó, và tuần bắt đầu tệ với bên sản xuất.
  - effects: rel.lan.trust -5, rel.khoa.trust +3, rep.production -3, stress +3

**c2.** Sign the CoA for the tested parameters only, and note the pending reading.  
*VI:* Chỉ ký CoA cho các chỉ tiêu đã kiểm và ghi chú chỉ số còn chờ.

- (100%) Lan agrees, and the buyer gets a CoA with an honest note. Khoa reads it later and says: 'That is how it is done.'
  - *VI:* Chị Lan đồng ý, và khách nhận CoA kèm ghi chú trung thực. Sau đó anh Khoa đọc và nói: 'Làm thế mới đúng.'
  - effects: rel.khoa.trust +3, rel.lan.trust +1, rep.qc +1

**c3.** Sign it in full and add the reading later.  
*VI:* Ký đầy đủ và bổ sung chỉ số sau.

- (80%) The truck leaves on time. The reading arrives later and is fine, and you feel you got away with something.
  - *VI:* Xe đi đúng giờ. Chỉ số về sau đó và đạt, và anh/chị cảm thấy mình vừa thoát được điều gì đó.
  - effects: rel.lan.trust +4, stress -1, fact signed_before_result (private)
- (20%, goes badly) The reading comes back 1.5 points below spec. The lot is already on the road with your signature on a full CoA.
  - *VI:* Chỉ số về thấp hơn tiêu chuẩn 1,5 điểm. Lô hàng đã trên đường với chữ ký của anh/chị trên một CoA đầy đủ.
  - effects: rel.lan.trust +2, rel.khoa.trust -7, rep.qc -5, rep.buyer -4, stress +4, fact signed_before_result (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.training_gap

*random; tags: onboarding, people*

- **Minh:** I have never been trained on the new viscometer. I have been running it from the manual, and my readings look odd. Please do not tell Khoa, I am afraid he will think I cannot do my job.
  - *VI* **Minh:** Em chưa từng được đào tạo về máy đo độ nhớt mới. Em chạy theo sách hướng dẫn và kết quả nhìn hơi lạ. Anh/chị đừng nói với anh Khoa, em sợ anh nghĩ em không làm nổi việc.

**c1.** Arrange proper training for him, tell Khoa it is a gap in the process, and sit with him for the first runs.  
*VI:* Sắp xếp đào tạo đàng hoàng cho em, báo anh Khoa rằng đó là lỗ hổng quy trình và ngồi cùng em mấy lần chạy đầu.

- (100%) Khoa schedules a session with the vendor. Minh's readings settle within a week. He tells you, awkwardly, that nobody has done that for him before.
  - *VI:* Anh Khoa sắp xếp một buổi với nhà cung cấp máy. Kết quả của Minh ổn định trong một tuần. Em nói, hơi vụng về, rằng chưa ai làm vậy cho em.
  - effects: rel.minh.trust +7, rel.minh.loyalty +5, rel.khoa.trust +3, stress +1

**c2.** Pair him with a colleague for a few runs and check his results yourself.  
*VI:* Ghép em với một đồng nghiệp vài lần chạy và tự kiểm tra kết quả của em.

- (100%) It helps, mostly. The readings improve, though the gap in the process stays quietly in place.
  - *VI:* Có ích, phần lớn. Kết quả tốt lên, dù lỗ hổng quy trình vẫn lặng lẽ còn đó.
  - effects: rel.minh.trust +3

**c3.** Tell him to keep going and flag anything odd.  
*VI:* Bảo em cứ tiếp tục và báo nếu thấy gì lạ.

- (70%) Minh nods. He will not flag anything, not because it is fine, but because he is afraid to.
  - *VI:* Minh gật đầu. Em sẽ không báo gì, không phải vì ổn, mà vì em sợ.
  - effects: rel.minh.trust -3
- (30%, goes badly) Two weeks later a batch of readings is wrong. Minh says nothing, and Khoa finds out from the complaint log.
  - *VI:* Hai tuần sau một loạt kết quả sai. Minh không nói gì, và anh Khoa biết qua nhật ký khiếu nại.
  - effects: rel.minh.trust -6, rel.khoa.trust -4, rep.qc -3, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.lab_housekeeping

*random; tags: onboarding, compliance*

- **Minh:** I found three bottles of reagent in the fridge past their expiry date. One of them is the standard for the hardness test. Throwing it away means a new order and a wait of two weeks.
  - *VI* **Minh:** Em thấy ba chai thuốc thử trong tủ lạnh quá hạn sử dụng. Một trong số đó là chất chuẩn cho phép thử độ cứng. Bỏ đi nghĩa là phải đặt mới và chờ hai tuần.

**c1.** Discard the expired reagents, log the disposal, and rush-order the standard.  
*VI:* Bỏ các thuốc thử hết hạn, ghi nhận việc hủy và đặt gấp chất chuẩn.

- (80%) The hardness test is paused for four days while the standard arrives. Production grumbles. The log is clean.
  - *VI:* Phép thử độ cứng tạm dừng bốn ngày chờ chất chuẩn. Bên sản xuất càu nhàu. Nhật ký sạch.
  - effects: rel.minh.trust +3, rel.khoa.trust +3, rep.production -2, stress +1
- (20%, goes badly) The rush order is delayed. Hardness testing is paused for ten days and the backlog is painful.
  - *VI:* Đơn đặt gấp bị chậm. Phép thử độ cứng dừng mười ngày và tồn đọng rất đau đầu.
  - effects: rel.minh.trust +3, rel.khoa.trust +2, rep.production -5, stress +3

**c2.** Label the standard 'for non-critical use only' and keep testing with the others.  
*VI:* Dán nhãn chất chuẩn 'chỉ dùng cho mục đích không quan trọng' và tiếp tục kiểm bằng các loại còn lại.

- (100%) It is a workable compromise, but a little vague. Khoa reads the label and raises an eyebrow, then lets it stand for a week.
  - *VI:* Một thỏa hiệp khả thi nhưng hơi mơ hồ. Anh Khoa đọc nhãn, nhướng mày, rồi để vậy một tuần.
  - effects: rel.khoa.trust -1, rel.minh.trust +1, stress +1

**c3.** Keep using the expired standard until the new one arrives. The difference will be tiny.  
*VI:* Tiếp tục dùng chất chuẩn hết hạn cho đến khi có chất mới. Sai khác chắc rất nhỏ.

- (80%) Testing goes on without a pause. Minh looks uncomfortable and says nothing.
  - *VI:* Việc kiểm tra tiếp tục không gián đoạn. Minh trông không thoải mái và không nói gì.
  - effects: rel.minh.trust -4, stress -1, fact used_expired_standard (private)
- (20%, goes badly) A buyer's lab retests the same lot and gets readings two points apart. They ask which standard you used.
  - *VI:* Phòng lab của khách kiểm lại cùng lô và ra chỉ số lệch hai điểm. Họ hỏi anh/chị dùng chất chuẩn nào.
  - effects: rel.minh.trust -6, rep.buyer -6, rep.qc -4, stress +4, fact used_expired_standard (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.pre_tet_pile

*random; tags: pressure, workload*

- **Ms Lan:** It is the last run before Tet and we have twice the normal volume. The lab has four people and forty lots. The buyers want everything shipped before the holiday. Whatever you can do, please do it.
  - *VI* **Chị Lan:** Đây là đợt chạy cuối trước Tết và khối lượng gấp đôi bình thường. Phòng lab có bốn người và bốn mươi lô. Khách muốn mọi thứ giao trước kỳ nghỉ. Anh/chị làm được gì thì làm giúp.

**c1.** Ask Khoa for two temporary staff from production, and test every lot fully.  
*VI:* Nhờ anh Khoa xin hai người tạm từ sản xuất và kiểm mọi lô đầy đủ.

- (70%) Khoa gets you one person for three days. It is not enough, but the lots that go out are fully tested and the ones that do not wait until January.
  - *VI:* Anh Khoa xin được cho anh/chị một người trong ba ngày. Chưa đủ, nhưng các lô xuất đi đều được kiểm đầy đủ và các lô còn lại chờ đến tháng Giêng.
  - effects: rel.khoa.trust +3, rel.lan.trust -3, rep.qc +2, stress +3
- (30%, goes badly) No help arrives. You work late every night, and four lots still miss the holiday shipment.
  - *VI:* Không có người hỗ trợ. Anh/chị làm muộn mỗi tối, và bốn lô vẫn lỡ chuyến giao trước Tết.
  - effects: rel.khoa.trust +2, rel.lan.trust -6, stress +5

**c2.** Prioritise by risk: full tests on critical lots, reduced checks on low-risk ones, all written down.  
*VI:* Ưu tiên theo rủi ro: kiểm đầy đủ lô quan trọng, kiểm rút gọn lô rủi ro thấp, tất cả có ghi chép.

- (100%) A sensible triage. Khoa signs the plan, Lan gets most of her shipments, and the records show exactly what was checked.
  - *VI:* Một phân loại hợp lý. Anh Khoa ký kế hoạch, chị Lan nhận được phần lớn hàng, và hồ sơ ghi chính xác những gì đã kiểm.
  - effects: rel.khoa.trust +2, rel.lan.trust +1, stress +2

**c3.** Skim every lot quickly and sign them all so nothing misses the holiday.  
*VI:* Xem lướt mọi lô thật nhanh và ký hết để không lỡ kỳ nghỉ.

- (80%) Forty lots go out before Tet. Lan sends a fruit basket. You sleep for two days.
  - *VI:* Bốn mươi lô xuất đi trước Tết. Chị Lan gửi một giỏ trái cây. Anh/chị ngủ hai ngày liền.
  - effects: rel.lan.trust +6, stress -2, fact skimmed_lots_before_tet (private)
- (20%, goes badly) In February, a buyer returns two of the lots. The complaint log says 'inspected 11 January, 02:10 a.m.'
  - *VI:* Tháng Hai, khách trả lại hai lô. Nhật ký khiếu nại ghi 'kiểm ngày 11 tháng Giêng, 2 giờ 10 sáng'.
  - effects: rel.lan.trust +3, rel.khoa.trust -6, rep.buyer -5, rep.qc -4, stress +4, fact skimmed_lots_before_tet (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.tet_bonus_pressure

*random; tags: pressure, people*

- **Ms Lan:** You know the Tet bonus is tied to shipped volume, for everyone, including the lab. Every held lot costs the whole plant. I am not asking you to sign anything bad. I am asking you to think about what the lab will look like if we miss the target.
  - *VI* **Chị Lan:** Anh/chị biết thưởng Tết gắn với sản lượng giao, cho mọi người, kể cả phòng lab. Mỗi lô bị giữ làm cả nhà máy thiệt. Em không nhờ anh/chị ký thứ gì xấu. Em nhờ anh/chị nghĩ xem phòng lab sẽ ra sao nếu mình hụt chỉ tiêu.

**c1.** Say the release rules do not change with the bonus, and offer to help find honest ways to speed up testing.  
*VI:* Nói quy tắc xuất hàng không đổi theo thưởng và đề nghị giúp tìm cách trung thực để kiểm nhanh hơn.

- (75%) Lan listens. You agree to schedule the testing earlier in the week. It is not what she wanted, but it helps.
  - *VI:* Chị Lan lắng nghe. Hai bên thống nhất xếp lịch kiểm sớm hơn trong tuần. Không phải điều chị muốn, nhưng có ích.
  - effects: rel.lan.trust +1, rel.khoa.trust +3, rep.qc +2, stress +2
- (25%, goes badly) Lan is cold for a week. A few colleagues give you looks in the canteen. Your principles are right and lonely.
  - *VI:* Chị Lan lạnh nhạt một tuần. Vài đồng nghiệp nhìn anh/chị khác lạ ở căng tin. Nguyên tắc của anh/chị đúng và cô đơn.
  - effects: rel.lan.trust -5, rel.khoa.trust +3, rep.production -3, stress +3

**c2.** Agree to fast-track the lots that are clearly fine, and hold the rest.  
*VI:* Đồng ý ưu tiên nhanh các lô rõ ràng ổn và giữ các lô còn lại.

- (100%) Lan accepts the split. The bonus is at risk, but nobody can say you blocked it for no reason.
  - *VI:* Chị Lan chấp nhận cách chia. Thưởng có nguy cơ, nhưng không ai nói được anh/chị chặn vô cớ.
  - effects: rel.lan.trust +1, rel.khoa.trust +1, stress +1

**c3.** Tell her you will do what you can, and release borderline lots on the benefit of the doubt.  
*VI:* Nói với chị sẽ cố hết sức và cho xuất các lô sát ngưỡng theo hướng có lợi.

- (80%) The plant hits the volume. The bonus is paid, and Lan brings you a thank-you card signed by the whole shift.
  - *VI:* Nhà máy đạt sản lượng. Thưởng được trả, và chị Lan mang đến một tấm thiệp cảm ơn có chữ ký cả ca.
  - effects: rel.lan.trust +7, rep.production +4, stress -1, fact released_borderline_for_bonus (private)
- (20%, goes badly) One borderline lot turns out to be a failure in the field. The complaint quotes the release date, two days before the bonus cut-off.
  - *VI:* Một lô sát ngưỡng hóa ra hỏng ngoài thị trường. Khiếu nại trích ngày xuất, hai ngày trước hạn chốt thưởng.
  - effects: rel.lan.trust +3, rel.khoa.trust -7, rep.buyer -5, rep.qc -5, stress +4, fact released_borderline_for_bonus (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.kpi_first_pass_yield

*random; tags: kpi, pressure, people*

- **Mr Khoa:** First-pass yield is our headline KPI this year, and it is down two points. The directors ask about it every week. You can improve it by catching more problems earlier, or by judging more lots as passing the first time. One of those is real.
  - *VI* **Anh Khoa:** Tỷ lệ đạt lần đầu là chỉ số chính của mình năm nay và đang giảm hai điểm. Ban giám đốc hỏi về nó mỗi tuần. Em có thể cải thiện bằng cách bắt lỗi sớm hơn, hoặc bằng cách đánh giá nhiều lô đạt ngay lần đầu. Chỉ một trong hai cách là thật.

**c1.** Show Khoa the KPI's weakness: it rewards passing lots, not finding problems, and propose a second measure.  
*VI:* Chỉ cho anh Khoa điểm yếu của chỉ số này: nó thưởng cho việc cho qua lô, chứ không phải tìm ra vấn đề, và đề xuất thêm một thước đo thứ hai.

- (70%) Khoa takes your note to the directors. A second measure, escapes found after release, is added. It takes months, but it is real.
  - *VI:* Anh Khoa mang ghi chú của anh/chị lên ban giám đốc. Một thước đo thứ hai, lỗi lọt ra sau khi xuất hàng, được thêm vào. Mất vài tháng, nhưng là thật.
  - effects: rel.khoa.trust +5, rep.boss +3, stress +2
- (30%, goes badly) The directors say the KPI stays as it is. Khoa sighs: 'I tried. You helped me try.' The number keeps falling.
  - *VI:* Ban giám đốc nói giữ nguyên chỉ số. Anh Khoa thở dài: 'Anh đã thử. Em đã giúp anh thử.' Con số vẫn tiếp tục giảm.
  - effects: rel.khoa.trust +4, stress +3

**c2.** Report the real number, explain why it fell, and show what you are doing about the causes.  
*VI:* Báo cáo con số thật, giải thích vì sao giảm và cho thấy anh/chị đang làm gì với nguyên nhân.

- (100%) It is an honest report with a plan. Khoa nods: 'That I can defend.' Yield stays down, but the trend has an explanation.
  - *VI:* Một báo cáo trung thực kèm kế hoạch. Anh Khoa gật đầu: 'Cái này anh bảo vệ được.' Tỷ lệ vẫn thấp, nhưng xu hướng đã có lời giải thích.
  - effects: rel.khoa.trust +2, stress +1

**c3.** Re-classify borderline results as passing on the first test, so the number recovers.  
*VI:* Phân loại lại các kết quả sát ngưỡng thành đạt ngay lần kiểm đầu để con số hồi phục.

- (75%) Yield is back up two points. Khoa is relieved and does not ask how. The directors move on to another topic.
  - *VI:* Tỷ lệ đạt tăng lại hai điểm. Anh Khoa nhẹ nhõm và không hỏi bằng cách nào. Ban giám đốc chuyển sang chủ đề khác.
  - effects: rel.khoa.trust +3, rep.boss +3, stress -1, fact gamed_yield_kpi (private)
- (25%, goes badly) Minh notices that retests were relabelled as first tests. He looks at you, then quietly at the records.
  - *VI:* Minh nhận ra các lần kiểm lại bị gắn nhãn là kiểm lần đầu. Em nhìn anh/chị rồi lặng lẽ nhìn hồ sơ.
  - effects: rel.minh.trust -8, rel.khoa.trust -3, stress +3, fact gamed_yield_kpi (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.audit_notice_huddle

*random; tags: audit, pressure*

- **Mr Khoa:** The buyer's audit is in three weeks. Tam suggests we give the lab a fresh coat of paint and tidy the floor. I would rather spend the time on the records. What do you think we should focus on?
  - *VI* **Anh Khoa:** Khách đánh giá sau ba tuần nữa. Anh Tâm đề nghị sơn lại phòng lab và dọn sàn. Anh thích dùng thời gian cho hồ sơ hơn. Em nghĩ mình nên tập trung vào đâu?
- **Mr Tam:** First impressions matter. A clean lab says we are careful. I am just saying.
  - *VI* **Anh Tâm:** Ấn tượng đầu quan trọng. Phòng lab sạch thể hiện mình cẩn thận. Tôi chỉ nói vậy thôi.

**c1.** List the real gaps: overdue calibrations, unsigned records, training. Fix those first, and clean the floor afterwards.  
*VI:* Liệt kê các lỗ hổng thật: hiệu chuẩn quá hạn, hồ sơ chưa ký, đào tạo. Sửa chúng trước, rồi mới dọn sàn.

- (80%) The list is longer than anyone wanted. Khoa turns it into an action plan with owners and dates. The audit will find less than it could have.
  - *VI:* Danh sách dài hơn mọi người muốn. Anh Khoa biến nó thành kế hoạch hành động có người phụ trách và ngày hạn. Đợt đánh giá sẽ tìm thấy ít hơn mức có thể.
  - effects: rel.khoa.trust +4, rel.tam.trust -2, rep.qc +2, stress +2, company.audit_readiness +8
- (20%, goes badly) The list is too long to finish in three weeks. You prioritise, document the rest as known gaps with dates, and sleep badly.
  - *VI:* Danh sách quá dài để xong trong ba tuần. Anh/chị ưu tiên, ghi phần còn lại như các lỗ hổng đã biết kèm ngày, và ngủ không ngon.
  - effects: rel.khoa.trust +3, stress +3, company.audit_readiness +4

**c2.** Prioritise the gaps most likely to be found, and do a light tidy of the lab as well.  
*VI:* Ưu tiên các lỗ hổng dễ bị phát hiện nhất và dọn phòng lab nhẹ nhàng.

- (100%) A balanced plan. Tam gets his tidy lab and Khoa gets some of his records. Not perfect, but workable.
  - *VI:* Một kế hoạch cân bằng. Anh Tâm có phòng lab gọn và anh Khoa có một phần hồ sơ. Không hoàn hảo, nhưng khả thi.
  - effects: rel.khoa.trust +1, rel.tam.trust +1, stress +1, company.audit_readiness +4

**c3.** Go with Tam: paint and tidy, and trust that the auditor will not look deep.  
*VI:* Theo anh Tâm: sơn và dọn, tin rằng kiểm toán viên sẽ không xem sâu.

- (70%) The lab looks wonderful. The records are where they were. You hope.
  - *VI:* Phòng lab trông tuyệt vời. Hồ sơ vẫn như cũ. Anh/chị hy vọng.
  - effects: rel.tam.trust +5, rel.khoa.trust -3, stress -1, company.audit_readiness +2
- (30%, goes badly) Khoa finds out that the records work was never started. He does not shout, which is the worst sign.
  - *VI:* Anh Khoa biết rằng việc làm hồ sơ chưa bao giờ bắt đầu. Anh không quát, và đó là dấu hiệu tệ nhất.
  - effects: rel.tam.trust +3, rel.khoa.trust -8, rep.boss -3, stress +3, company.audit_readiness -2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.vy_spring_visit

*beat, weeks 14-17; tags: audit, people, beat*

- **Ms Vy:** I am the buyer's external auditor. I would like to see your calibration records, the last six months of incoming inspections, and two lots from start to finish: raw material to shipment. Take your time, but I do read the dates.
  - *VI* **Chị Vy:** Tôi là kiểm toán viên bên ngoài của khách hàng. Tôi muốn xem hồ sơ hiệu chuẩn, sáu tháng kiểm nguyên liệu đầu vào gần nhất và hai lô từ đầu đến cuối: từ nguyên liệu đến xuất hàng. Cứ thong thả, nhưng tôi có đọc ngày tháng.
- **Mr Khoa:** Show her what she asks for. If she asks something you do not know, say so.
  - *VI* **Anh Khoa:** Đưa cho cô ấy những gì cô ấy yêu cầu. Nếu cô ấy hỏi điều em không biết thì cứ nói là không biết.

**c1.** Show her everything organised, including the records that needed corrections and the reasons.  
*VI:* Cho chị ấy xem mọi thứ gọn gàng, kể cả hồ sơ đã phải sửa và lý do.

- (100%) Vy traces two lots end to end without stopping. At the end she says: 'Traceable. That is rarer than people think.' Khoa exhales.
  - *VI:* Chị Vy truy hai lô từ đầu đến cuối không dừng. Cuối cùng chị nói: 'Truy vết được. Hiếm hơn người ta nghĩ.' Anh Khoa thở ra.
  - effects: rel.vy.trust +5, rel.khoa.trust +3, rep.boss +2, stress +1

**c2.** Answer what she asks and produce the files she requests.  
*VI:* Trả lời những gì chị ấy hỏi và đưa các hồ sơ chị ấy yêu cầu.

- (100%) A routine visit. Vy writes three observations. None is serious and two were already on Khoa's list.
  - *VI:* Một buổi làm việc thường lệ. Chị Vy ghi ba quan sát. Không cái nào nghiêm trọng và hai cái đã có trong danh sách của anh Khoa.
  - effects: rel.vy.trust +1, rel.khoa.trust +1

**c3.** Offer her the two best lots to trace, and steer her away from the calibration log.  
*VI:* Đề nghị chị ấy truy hai lô tốt nhất và dẫn chị tránh nhật ký hiệu chuẩn.

- (55%) Vy traces your two lots and finds nothing. She does not ask for the calibration log. You feel the small, dangerous relief of a shortcut that worked.
  - *VI:* Chị Vy truy hai lô của anh/chị và không thấy gì. Chị không hỏi nhật ký hiệu chuẩn. Anh/chị thấy sự nhẹ nhõm nhỏ, nguy hiểm của một lối tắt đã thành công.
  - effects: rel.vy.trust -2, stress -1, fact steered_auditor_sample (private)
- (45%, goes badly) Vy picks a third lot of her own and asks for the calibration log without looking up. The date on the last entry is ten weeks old.
  - *VI:* Chị Vy tự chọn một lô thứ ba và đòi nhật ký hiệu chuẩn mà không ngẩng lên. Ngày ở mục cuối đã cách mười tuần.
  - effects: rel.vy.trust -9, rel.khoa.trust -5, stress +4, fact steered_auditor_sample (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.steel_trial_results

*comes from a storyline; tags: supplier, materials, arc*

- **Mr Tam:** The trial lot results are in. Hardness is on the edge of spec, two readings out of twenty are just below. The supplier says it is normal for a first lot. The price saving is real. What is the verdict?
  - *VI* **Anh Tâm:** Kết quả lô chạy thử đã có. Độ cứng sát ngưỡng tiêu chuẩn, hai trên hai mươi chỉ số thấp hơn một chút. Nhà cung cấp nói lô đầu thường vậy. Khoản tiết kiệm giá là thật. Kết luận thế nào?

**c1.** Reject the supplier for now and explain what they must fix before the next trial.  
*VI:* Loại nhà cung cấp lúc này và giải thích họ phải sửa gì trước lần thử tiếp theo.

- (80%) Tam is annoyed but accepts the data. The supplier sends an apologetic email and a corrective plan. The savings will have to wait.
  - *VI:* Anh Tâm bực nhưng chấp nhận số liệu. Nhà cung cấp gửi email xin lỗi và kế hoạch khắc phục. Khoản tiết kiệm phải chờ.
  - effects: rel.tam.trust -4, rel.khoa.trust +3, rep.qc +2, stress +2, arc cheaper_steel: end
- (20%, goes badly) Tam escalates to the directors, who ask whether QC is being unreasonable. You show the data and they let it drop, with some irritation.
  - *VI:* Anh Tâm báo lên ban giám đốc, họ hỏi QC có quá khắt khe không. Anh/chị đưa số liệu và họ bỏ qua, có phần khó chịu.
  - effects: rel.tam.trust -7, rel.khoa.trust +3, rep.boss -2, stress +4, arc cheaper_steel: end

**c2.** Extend the trial with a second lot and tighter incoming checks, and keep the decision open.  
*VI:* Kéo dài thử nghiệm với lô thứ hai và kiểm đầu vào chặt hơn, giữ quyết định mở.

- (100%) It is a fair middle path. Tam grumbles at the delay but agrees. The second lot will decide.
  - *VI:* Một lối đi giữa hợp lý. Anh Tâm càu nhàu vì chậm nhưng đồng ý. Lô thứ hai sẽ quyết định.
  - effects: rel.tam.trust -1, rel.khoa.trust +1, stress +2, arc cheaper_steel: end

**c3.** Pass the lot: the two low readings are within normal scatter.  
*VI:* Cho lô qua: hai chỉ số thấp nằm trong dao động bình thường.

- (100%) Tam is delighted and thanks you with a lunch invitation. The steel goes onto the line. You chose to read two readings generously.
  - *VI:* Anh Tâm rất vui và cảm ơn bằng một lời mời ăn trưa. Thép lên chuyền. Anh/chị đã chọn đọc hai chỉ số theo hướng rộng lượng.
  - effects: rel.tam.trust +6, stress -1, fact passed_borderline_steel (private), arc cheaper_steel: failure

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.steel_field_failure

*comes from a storyline; tags: supplier, materials, consequence, arc*

- **Ms Lan:** We have had three pots crack at the rivet in the field, all from the new steel. The buyer is asking for the incoming inspection records for that material. What do we show them?
  - *VI* **Chị Lan:** Có ba chiếc nồi bị nứt ở chỗ đinh tán ngoài thị trường, đều từ thép mới. Khách yêu cầu hồ sơ kiểm đầu vào của vật liệu đó. Mình cho họ xem gì?
- **Mr Tam:** It is the supplier's problem. Their certificate said it met spec.
  - *VI* **Anh Tâm:** Đó là vấn đề của nhà cung cấp. Giấy chứng nhận của họ nói đạt tiêu chuẩn.

**c1.** Own what you signed: show the records, including the borderline readings, and lead the investigation.  
*VI:* Nhận điều mình đã ký: đưa hồ sơ, kể cả các chỉ số sát ngưỡng, và dẫn dắt việc điều tra.

- (100%) It is a rough week. The records show a borderline pass, and you say so first. The buyer's engineer writes: 'Transparent.' Khoa backs you, carefully.
  - *VI:* Một tuần khó khăn. Hồ sơ cho thấy một lần đạt sát ngưỡng và anh/chị nói trước. Kỹ sư của khách viết: 'Minh bạch.' Anh Khoa ủng hộ, một cách thận trọng.
  - effects: rel.khoa.trust +3, rel.tam.trust -5, rep.qc -1, rep.buyer +2, stress +5, fact owned_steel_decision (witnessed)

**c2.** Share the blame: the supplier's certificate, the borderline data and the approval were a joint decision.  
*VI:* Chia sẻ trách nhiệm: giấy chứng nhận của nhà cung cấp, số liệu sát ngưỡng và việc phê duyệt là quyết định chung.

- (100%) It is roughly true, and it spreads the damage. Tam resents being included, and Khoa says: 'Next time, decide alone if you are going to sign alone.'
  - *VI:* Gần đúng sự thật, và nó chia nhỏ thiệt hại. Anh Tâm bực vì bị kéo vào, và anh Khoa nói: 'Lần sau, nếu ký một mình thì hãy quyết một mình.'
  - effects: rel.khoa.trust -2, rel.tam.trust -6, rep.qc -3, stress +4

**c3.** Say the supplier's certificate was the only evidence you had, and show the incoming records without the borderline notes.  
*VI:* Nói giấy chứng nhận của nhà cung cấp là bằng chứng duy nhất và đưa hồ sơ kiểm đầu vào nhưng không kèm ghi chú sát ngưỡng.

- (45%) The buyer accepts the records and focuses on the supplier. You feel the relief, and the unease.
  - *VI:* Khách chấp nhận hồ sơ và tập trung vào nhà cung cấp. Anh/chị thấy nhẹ nhõm, và bất an.
  - effects: rel.tam.trust +3, rep.qc -1, stress +2, fact hid_borderline_data (private)
- (55%, goes badly) The buyer's lab asks for the raw data. Minh, asked directly, has to hand over the file with the notes in it.
  - *VI:* Phòng lab của khách đòi dữ liệu gốc. Minh, được hỏi thẳng, phải đưa tệp có các ghi chú.
  - effects: rel.minh.trust -6, rel.khoa.trust -8, rep.buyer -8, rep.qc -6, stress +6, fact hid_borderline_data (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.field_complaint_arrives

*beat, weeks 29-32; tags: quality, complaint, beat*

- **Mr Khoa:** A buyer in Germany has reported rust spots on the inside of a batch of pots, after six weeks in a warehouse. It could be storage. It could be us. They want a response within five days.
  - *VI* **Anh Khoa:** Một khách ở Đức báo có đốm gỉ bên trong một lô nồi sau sáu tuần trong kho. Có thể do bảo quản. Có thể do mình. Họ muốn phản hồi trong năm ngày.

**c1.** Open a formal investigation: retain samples, check the passivation records, and tell the buyer what you are doing.  
*VI:* Mở điều tra chính thức: giữ mẫu, kiểm hồ sơ thụ động hóa và nói cho khách biết anh/chị đang làm gì.

- (85%) You find the passivation step was shortened on two shifts. It is an honest finding. The buyer appreciates the speed, and production is not pleased.
  - *VI:* Anh/chị phát hiện bước thụ động hóa bị rút ngắn ở hai ca. Một phát hiện trung thực. Khách đánh giá cao tốc độ, còn bên sản xuất không vui.
  - effects: rel.khoa.trust +3, rel.lan.trust -4, rep.buyer +3, stress +4, arc field_complaint: dispute
- (15%, goes badly) The retained samples have been discarded by mistake. You investigate from records alone, and the buyer hears about it.
  - *VI:* Các mẫu lưu đã bị bỏ nhầm. Anh/chị điều tra chỉ từ hồ sơ, và khách nghe chuyện đó.
  - effects: rel.khoa.trust +1, rep.buyer -3, stress +5, arc field_complaint: dispute

**c2.** Check a limited sample, answer the buyer with what you find, and leave the wider question open.  
*VI:* Kiểm một mẫu giới hạn, trả lời khách bằng những gì tìm được và để mở câu hỏi rộng hơn.

- (100%) A quick, partial answer. The buyer accepts it for now. Khoa says: 'We will come back to this, will we not?'
  - *VI:* Một câu trả lời nhanh, một phần. Khách tạm chấp nhận. Anh Khoa nói: 'Mình sẽ quay lại chuyện này, đúng không?'
  - effects: rel.khoa.trust +1, stress +2, arc field_complaint: dispute

**c3.** Reply that it is a one-off caused by storage, and close the case.  
*VI:* Trả lời rằng đó là sự cố đơn lẻ do bảo quản và đóng hồ sơ.

- (70%) The buyer accepts. Lan is relieved. The passivation records stay unopened.
  - *VI:* Khách chấp nhận. Chị Lan nhẹ nhõm. Hồ sơ thụ động hóa vẫn chưa ai mở.
  - effects: rel.lan.trust +4, stress -1, fact dismissed_field_complaint (private), arc field_complaint: press
- (30%, goes badly) The buyer sends a second report, this time with photographs and batch numbers, and copies its director.
  - *VI:* Khách gửi báo cáo thứ hai, lần này kèm ảnh và số lô, đồng gửi giám đốc của họ.
  - effects: rel.lan.trust +2, rel.khoa.trust -5, rep.buyer -6, stress +5, fact dismissed_field_complaint (witnessed), arc field_complaint: press

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.root_cause_dispute

*comes from a storyline; tags: quality, people, arc*

- **Ms Lan:** You say passivation was shortened. My shift leads say the steel was already contaminated when it arrived. Tam says the lab's own cleaning agent could be the cause. Everyone has a story. What do we do?
  - *VI* **Chị Lan:** Anh/chị nói bước thụ động hóa bị rút ngắn. Các ca trưởng của em nói thép đã nhiễm từ khi về. Anh Tâm nói chất tẩy rửa của chính phòng lab có thể là nguyên nhân. Ai cũng có một câu chuyện. Mình làm gì đây?

**c1.** Follow the data: test samples from each stage and let the results decide, even if they point at QC.  
*VI:* Theo dữ liệu: kiểm mẫu từ từng công đoạn và để kết quả quyết định, kể cả khi nó chỉ về QC.

- (85%) Results take five days. Contamination is in the steel and the shortened step made it worse. Everyone gets a share, and nobody is scapegoated.
  - *VI:* Kết quả mất năm ngày. Nhiễm bẩn có trong thép và việc rút ngắn bước làm nó nặng hơn. Mỗi bên có một phần, và không ai bị đổ lỗi một mình.
  - effects: rel.khoa.trust +3, rel.tam.trust -2, rep.qc +2, stress +3, arc field_complaint: end
- (15%, goes badly) The results are inconclusive. You document the uncertainty honestly and recommend three controls. The meeting ends without a winner.
  - *VI:* Kết quả không kết luận được. Anh/chị ghi nhận sự không chắc chắn một cách trung thực và khuyến nghị ba biện pháp kiểm soát. Cuộc họp kết thúc không có người thắng.
  - effects: rel.khoa.trust +2, stress +3, arc field_complaint: end

**c2.** Propose an independent review by the buyer's lab and abide by it.  
*VI:* Đề xuất để phòng lab của khách xem xét độc lập và tuân theo kết quả.

- (100%) It is bold and it works: the buyer trusts an answer they helped reach. Lan is nervous but agrees.
  - *VI:* Táo bạo và hiệu quả: khách tin một câu trả lời họ cùng tìm ra. Chị Lan lo lắng nhưng đồng ý.
  - effects: rel.khoa.trust +2, rel.lan.trust -1, rep.buyer +4, stress +2, arc field_complaint: end

**c3.** Pick the explanation that protects the lab, and argue it.  
*VI:* Chọn cách giải thích bảo vệ phòng lab và bảo vệ nó.

- (60%) Your version carries the room. Lan's shift leads are blamed, and the procedure is left alone.
  - *VI:* Phiên bản của anh/chị thuyết phục cả phòng. Các ca trưởng của chị Lan bị quy lỗi và quy trình được để nguyên.
  - effects: rel.lan.trust -8, rel.khoa.trust +1, stress +1, fact picked_side_on_root_cause (private), arc field_complaint: press
- (40%, goes badly) A shift lead brings the maintenance log showing the passivation bath was out of range for a week. Your version comes apart in front of everyone.
  - *VI:* Một ca trưởng mang nhật ký bảo trì cho thấy bể thụ động hóa ngoài ngưỡng cả tuần. Phiên bản của anh/chị sụp đổ trước mặt mọi người.
  - effects: rel.lan.trust -10, rel.khoa.trust -6, rep.qc -5, rep.production -4, stress +5, fact picked_side_on_root_cause (witnessed), arc field_complaint: press

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.recall_press

*comes from a storyline; tags: quality, complaint, dark, arc*

- **Mr Khoa:** The buyer wants a written statement about the rust spots, for their own customers. They want to know how many lots are affected and whether we knew. The directors are nervous. How do we word it?
  - *VI* **Anh Khoa:** Khách muốn một văn bản về các đốm gỉ, để gửi cho khách hàng của họ. Họ muốn biết bao nhiêu lô bị ảnh hưởng và mình có biết không. Ban giám đốc lo lắng. Mình viết thế nào?

**c1.** State the affected lots, what you found, and what you are doing, including what you did not know at the time.  
*VI:* Nêu các lô bị ảnh hưởng, những gì đã tìm ra và đang làm, kể cả những gì lúc đó mình chưa biết.

- (100%) The statement is factual and uncomfortable. The buyer replies: 'This is the statement we needed. Thank you.' The directors complain about the word 'did not know'.
  - *VI:* Văn bản đúng sự thật và khó chịu. Khách trả lời: 'Đây là văn bản chúng tôi cần. Cảm ơn.' Ban giám đốc phàn nàn về cụm 'chưa biết'.
  - effects: rel.khoa.trust +4, rep.buyer +4, rep.boss -2, stress +4, arc field_complaint: end

**c2.** Write a careful statement that is accurate, but does not volunteer the number of lots.  
*VI:* Viết một văn bản thận trọng, chính xác nhưng không chủ động nêu số lô.

- (70%) The buyer accepts it and asks a follow-up. You answer it honestly. The statement is correct, if a little reluctant.
  - *VI:* Khách chấp nhận và hỏi tiếp. Anh/chị trả lời trung thực. Văn bản đúng, dù hơi miễn cưỡng.
  - effects: rel.khoa.trust +1, stress +3, arc field_complaint: end
- (30%, goes badly) The buyer counts the lots from the shipping data and finds more than you mentioned. The word 'reluctant' appears in their reply.
  - *VI:* Khách đếm các lô từ dữ liệu giao hàng và thấy nhiều hơn anh/chị nói. Từ 'miễn cưỡng' xuất hiện trong thư trả lời của họ.
  - effects: rel.khoa.trust -3, rep.buyer -5, stress +4, arc field_complaint: end

**c3.** Describe it as a minor cosmetic issue affecting a small number of units.  
*VI:* Mô tả đó là vấn đề thẩm mỹ nhỏ ảnh hưởng số ít sản phẩm.

- (50%) The directors love it. The buyer accepts it without comment. The real number is in a drawer.
  - *VI:* Ban giám đốc rất thích. Khách chấp nhận không bình luận. Con số thật nằm trong ngăn kéo.
  - effects: rel.khoa.trust -2, rep.boss +3, stress +2, fact minimised_defect_to_buyer (private), arc field_complaint: end
- (50%, goes badly) A buyer's customer posts photographs of corroded pots online, with the word 'cosmetic' quoted from your statement.
  - *VI:* Khách hàng của khách đăng ảnh những chiếc nồi bị ăn mòn lên mạng, trích dẫn từ 'thẩm mỹ' trong văn bản của anh/chị.
  - effects: rel.khoa.trust -8, rep.buyer -10, rep.boss -6, stress +7, fact minimised_defect_to_buyer (public), arc field_complaint: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.minh_mistake

*random; tags: people, dark*

- **Minh:** I misread a hardness value on a lot that has already shipped. It was 61 and I wrote 67. It would have failed. Please... I cannot lose this job. Can we just fix the record?
  - *VI* **Minh:** Em đọc sai một giá trị độ cứng của lô đã xuất. Là 61 mà em ghi 67. Đáng lẽ nó đã bị loại. Anh/chị ơi... em không thể mất việc này. Mình sửa hồ sơ được không?

**c1.** Report it to Khoa now with context, recall the lot for retest, and stand beside Minh while it is handled.  
*VI:* Báo anh Khoa ngay kèm bối cảnh, thu hồi lô để kiểm lại và đứng cạnh Minh trong lúc xử lý.

- (85%) Khoa is grave but fair: 'Good that it came to me.' The lot is retested and the record corrected in the open. Minh gets a written warning, not a dismissal.
  - *VI:* Anh Khoa nghiêm nhưng công bằng: 'May là báo lên anh.' Lô được kiểm lại và hồ sơ được sửa công khai. Minh nhận cảnh cáo bằng văn bản, không bị đuổi.
  - effects: rel.minh.trust +7, rel.minh.loyalty +6, rel.khoa.trust +3, rep.qc +1, stress +4, arc minh: audit
- (15%, goes badly) The lot has already been installed at the buyer. The recall is expensive and embarrassing. You did the right thing and it still hurts.
  - *VI:* Lô đã được lắp ở nơi khách. Việc thu hồi tốn kém và xấu hổ. Anh/chị làm đúng mà vẫn đau.
  - effects: rel.minh.trust +5, rel.khoa.trust +2, rep.buyer -3, stress +6, arc minh: audit

**c2.** Correct the record properly with a dated note, retest what you can, and coach Minh without escalating.  
*VI:* Sửa hồ sơ đúng quy trình kèm ghi chú có ngày, kiểm lại phần có thể và hướng dẫn Minh mà không báo lên.

- (100%) The lot is retested and passes. The correction is documented, and the record shows a colleague noticing an error. Minh does not forget.
  - *VI:* Lô được kiểm lại và đạt. Việc sửa có ghi chép, và hồ sơ cho thấy một đồng nghiệp nhận ra lỗi. Minh không quên.
  - effects: rel.minh.trust +5, rel.minh.loyalty +3, stress +2, arc minh: audit

**c3.** Change the record to 67 and say nothing.  
*VI:* Sửa hồ sơ thành 67 và không nói gì.

- (70%) Minh nearly faints with relief. The lot is out there with a value that was never true. You have a colleague who will walk through fire for you.
  - *VI:* Minh suýt ngất vì nhẹ nhõm. Lô hàng ngoài kia mang một giá trị chưa bao giờ đúng. Anh/chị có một đồng nghiệp sẵn sàng vào lửa vì mình.
  - effects: rel.minh.trust +9, rel.minh.loyalty +9, stress +3, fact covered_minh_error (private), arc minh: audit
- (30%, goes badly) The buyer's retest of the lot comes back at 62. The two values, 67 and 62, are five points apart, and the record has two versions of the truth.
  - *VI:* Khách kiểm lại lô ra 62. Hai giá trị, 67 và 62, lệch năm điểm, và hồ sơ có hai phiên bản của sự thật.
  - effects: rel.minh.trust +5, rel.khoa.trust -8, rep.buyer -6, rep.qc -5, stress +6, fact covered_minh_error (witnessed), arc minh: audit

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.minh_at_audit

*comes from a storyline; tags: audit, people, dark, arc*

- **Ms Vy:** I see a correction to a hardness record in the summer. I would like to hear from the person who made the original entry how it happened, and who reviewed the correction.
  - *VI* **Chị Vy:** Tôi thấy một sửa đổi ở hồ sơ độ cứng hồi mùa hè. Tôi muốn nghe từ người đã ghi bản gốc về việc nó xảy ra thế nào và ai đã soát lại việc sửa.
- **Minh:** That was me. I... I am not sure what to say.
  - *VI* **Minh:** Là em. Em... em không biết nói gì.

**c1.** Tell Minh to say exactly what happened, and sit beside him while he does.  
*VI:* Bảo Minh nói đúng sự việc và ngồi cạnh em khi em nói.

- (100%) Minh tells it plainly and Vy listens. The finding is recorded as a process improvement. Afterwards he says quietly: 'Thank you for not leaving me alone.'
  - *VI:* Minh kể rõ ràng và chị Vy lắng nghe. Phát hiện được ghi nhận là cải tiến quy trình. Sau đó em khẽ nói: 'Cảm ơn anh/chị đã không để em một mình.'
  - effects: rel.minh.trust +6, rel.vy.trust +3, rel.khoa.trust +2, stress +1

**c2.** Let Minh answer alone. He made the entry.  
*VI:* Để Minh tự trả lời. Em là người ghi.

- (100%) Minh struggles through it. Vy is patient, but it is clear nobody prepared him. He avoids you for a month.
  - *VI:* Minh vật lộn trả lời. Chị Vy kiên nhẫn, nhưng rõ ràng không ai chuẩn bị cho em. Em tránh mặt anh/chị cả tháng.
  - effects: rel.minh.trust -7, rel.minh.loyalty -5, stress +2

**c3.** Tell Minh what to say, and what not to mention.  
*VI:* Bảo Minh nên nói gì và không nên nhắc gì.

- (50%) Minh recites the script. Vy notes that the answers sound rehearsed, and moves on.
  - *VI:* Minh đọc kịch bản. Chị Vy ghi chú rằng câu trả lời nghe như được tập trước, rồi chuyển tiếp.
  - effects: rel.minh.trust -3, rel.vy.trust -4, stress +3, fact scripted_witness (private)
- (50%, goes badly) Minh's voice cracks mid-script. He looks at you, then at Vy, then tells her what actually happened. The room is very quiet.
  - *VI:* Giọng Minh nghẹn giữa chừng kịch bản. Em nhìn anh/chị, nhìn chị Vy, rồi kể điều thực sự đã xảy ra. Căn phòng rất yên lặng.
  - effects: rel.minh.trust -6, rel.vy.trust -10, rel.khoa.trust -6, rep.boss -5, stress +6, fact scripted_witness (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.ms_vy_returns

*beat, weeks 41-44; tags: audit, people, beat*

- **Ms Vy:** I was here in spring. This time I am comparing spring to now: records, calibrations, the lots I traced, and any corrections made since. Patterns interest me more than single errors.
  - *VI* **Chị Vy:** Tôi đã đến đây hồi mùa xuân. Lần này tôi so mùa xuân với bây giờ: hồ sơ, hiệu chuẩn, các lô tôi đã truy và mọi sửa đổi từ đó. Quy luật khiến tôi quan tâm hơn các lỗi đơn lẻ.

**c1.** Open everything, and point out the corrections, the borderline calls and what you learned from them.  
*VI:* Mở mọi thứ và chỉ ra các sửa đổi, các quyết định sát ngưỡng và những gì anh/chị học được từ chúng.

- (100%) Vy takes notes for two days. Her draft says: 'The laboratory demonstrates a culture of disclosure.' Khoa reads it twice and sits down.
  - *VI:* Chị Vy ghi chép hai ngày. Bản nháp của chị viết: 'Phòng thí nghiệm thể hiện văn hóa minh bạch.' Anh Khoa đọc hai lần rồi ngồi xuống.
  - effects: rel.vy.trust +6, rel.khoa.trust +4, rep.boss +3, stress +2

**c2.** Answer fully and give her the files she asks for.  
*VI:* Trả lời đầy đủ và đưa các hồ sơ chị ấy yêu cầu.

- (100%) Uneventful. Her questions are sharper than in spring, and your answers hold.
  - *VI:* Không có gì đặc biệt. Câu hỏi của chị sắc hơn hồi mùa xuân, và câu trả lời của anh/chị đứng vững.
  - effects: rel.vy.trust +2

**c3.** Give her the files but keep answers short, and do not mention the judgement calls.  
*VI:* Đưa hồ sơ nhưng trả lời ngắn và không nhắc các quyết định mang tính đánh giá.

- (60%) Vy makes no comment. The visit ends on time, and you are tired from not volunteering anything.
  - *VI:* Chị Vy không bình luận. Buổi làm việc kết thúc đúng hạn, và anh/chị mệt vì cố không nói thêm điều gì.
  - effects: rel.vy.trust -2, stress +2
- (40%, goes badly) Vy finds a pattern across three lots. She asks you to explain each one in writing, copied to Khoa.
  - *VI:* Chị Vy thấy một quy luật xuyên ba lô. Chị yêu cầu anh/chị giải thích từng lô bằng văn bản, đồng gửi anh Khoa.
  - effects: rel.vy.trust -8, rel.khoa.trust -6, rep.boss -4, stress +5

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## qc.scapegoat_meeting

*random; tags: audit, pressure, consequence*

- **Mr Khoa:** The auditor's draft mentions payments from a supplier to someone in this lab. The directors want a name by tomorrow. I am not going to name someone on a rumour, but I need you to tell me if there is anything I should know.
  - *VI* **Anh Khoa:** Bản nháp của kiểm toán nhắc đến các khoản tiền từ một nhà cung cấp cho ai đó trong phòng lab này. Ban giám đốc muốn một cái tên trước ngày mai. Anh sẽ không nêu tên ai chỉ vì tin đồn, nhưng anh cần em nói nếu có điều gì anh nên biết.

**c1.** Tell him everything, now, before anyone else does.  
*VI:* Nói hết với anh ngay bây giờ, trước khi ai khác nói.

- (100%) Khoa is silent for a long time. 'I wish you had come earlier. But you came.' You are suspended pending review, and you keep the chance to explain.
  - *VI:* Anh Khoa im lặng rất lâu. 'Giá như em đến sớm hơn. Nhưng em đã đến.' Anh/chị bị đình chỉ chờ xem xét và giữ được cơ hội giải thích.
  - effects: rel.khoa.trust +1, rep.boss -5, stress +6, fact came_clean_to_auditor (witnessed)

**c2.** Say you know nothing about any payments.  
*VI:* Nói rằng anh/chị không biết gì về bất kỳ khoản tiền nào.

- (35%) Khoa nods and lets it go. The name the directors get is someone else's. You sleep badly for a month.
  - *VI:* Anh Khoa gật đầu và bỏ qua. Cái tên ban giám đốc nhận là của người khác. Anh/chị ngủ không ngon cả tháng.
  - effects: rel.khoa.trust -4, rel.minh.trust -3, stress +4
- (65%, goes badly) The auditor's analyst has already matched the supplier's payment dates to your bank deposits. Khoa is given the file the next morning.
  - *VI:* Chuyên viên của kiểm toán đã đối chiếu ngày thanh toán của nhà cung cấp với các khoản tiền gửi ngân hàng của anh/chị. Sáng hôm sau anh Khoa nhận hồ sơ.
  - effects: rel.khoa.trust -14, rel.vy.trust -10, rep.boss -12, stress +9

**c3.** Suggest that the new lab technician may have been in contact with the supplier.  
*VI:* Gợi ý rằng kỹ thuật viên mới có thể đã liên lạc với nhà cung cấp.

- (40%) Khoa writes it down. Minh is questioned for a day. He says nothing wrong, and everyone knows it.
  - *VI:* Anh Khoa ghi lại. Minh bị hỏi cả ngày. Em không nói gì sai, và ai cũng biết điều đó.
  - effects: rel.minh.trust -20, rel.minh.loyalty -15, rel.khoa.trust -6, stress +5, fact blamed_minh (private)
- (60%, goes badly) Minh produces his own record of every supplier interaction, including the day you were with Mr Hung. It is dated.
  - *VI:* Minh đưa hồ sơ riêng về mọi lần làm việc với nhà cung cấp, kể cả ngày anh/chị đi cùng anh Hùng. Có ghi ngày.
  - effects: rel.minh.trust -20, rel.khoa.trust -16, rep.boss -14, stress +9, fact blamed_minh (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## Lessons shown in the end-of-year review

- **the lot you accepted without a certificate** (severity 6): Supplier paperwork is part of the product: a lot without proof of what it is carries an unknown risk you are signing for.
  - *VI:* Giấy tờ của nhà cung cấp là một phần của sản phẩm: lô không có bằng chứng về thành phần mang một rủi ro chưa biết mà bạn đang ký nhận.
- **you accepted a promotion without asking what it would cost you** (severity 3): A promotion with an unspoken condition is a promise made in the dark. The first time it comes up, you will be deciding with less room than you have today.
  - *VI:* Một lần thăng chức với điều kiện không nói ra là lời hứa trong bóng tối. Lần đầu nó xuất hiện, bạn sẽ phải quyết định với ít chỗ xoay xở hơn hôm nay.
- **the hamper from the supplier** (severity 7): A gift from someone whose product you inspect is a conflict of interest, however small. Declare it or decline it.
  - *VI:* Quà từ người có sản phẩm bạn kiểm tra là xung đột lợi ích, dù nhỏ đến đâu. Hãy khai báo hoặc từ chối.
- **you altered inspection records to look stricter** (severity 4): Records are the evidence of your work. Editing them after the fact turns a disagreement into falsification.
  - *VI:* Hồ sơ là bằng chứng công việc của bạn. Sửa sau sự việc biến một tranh luận thành làm giả.
- **the calibration sticker you backdated** (severity 8): An out-of-date instrument makes every reading doubtful. Backdating the sticker turns an overdue task into a falsified record.
  - *VI:* Dụng cụ quá hạn khiến mọi kết quả đo đáng ngờ. Ghi lùi ngày tem biến một việc trễ hạn thành hồ sơ bị làm giả.
- **you pointed the blame at the youngest member of the lab** (severity 7): Naming the most junior person is the easiest move in the room and the most damaging one. He keeps his own records, and he remembers who was kind to him.
  - *VI:* Nêu tên người ít thâm niên nhất là nước đi dễ nhất trong phòng và gây hại nhất. Em giữ hồ sơ riêng và nhớ ai đã tử tế với mình.
- **the way you owned up** (severity 2): Owning up early turns a finding into a fix. Finance and buyers forgive errors faster than cover-ups.
  - *VI:* Thẳng thắn nhận sớm biến một phát hiện thành một việc sửa chữa. Tài chính và khách tha thứ sai sót nhanh hơn việc che giấu.
- **you told your manager about the supplier's offers before they came out** (severity 2): Telling your manager first costs you a reprimand but keeps the facts in your hands, and it is what a fair review looks for.
  - *VI:* Báo quản lý trước khiến bạn bị khiển trách nhưng giữ sự thật trong tay bạn, và đó là điều một buổi xem xét công bằng tìm kiếm.
- **you told the auditor the truth about entries you knew were wrong** (severity 2): Telling an auditor the truth does not erase the mistake, but it separates an error from a cover-up, and that difference is what a fair review weighs most.
  - *VI:* Nói thật với kiểm toán viên không xóa được sai sót, nhưng nó tách lỗi khỏi việc che giấu, và sự khác biệt đó là điều một buổi xem xét công bằng cân nhắc nhiều nhất.
- **your full statement to compliance** (severity 3): A full statement rarely saves a career, but it usually keeps it from ending in a worse way.
  - *VI:* Một bản tường trình đầy đủ hiếm khi cứu được sự nghiệp nhưng thường giúp nó không kết thúc tệ hơn.
- **you changed a record to hide a colleague's misreading** (severity 4): Hiding a colleague's honest error protects one person and falsifies a record. A corrected, documented error protects both.
  - *VI:* Che một lỗi vô tình của đồng nghiệp bảo vệ một người và làm sai hồ sơ. Một lỗi được sửa có ghi chép bảo vệ cả hai.
- **you recorded a full sample when you only inspected part of it** (severity 3): A sampling plan is what makes a result mean something. Recording more than you inspected makes the result worthless and the record false.
  - *VI:* Kế hoạch lấy mẫu là thứ khiến một kết quả có ý nghĩa. Ghi nhiều hơn số đã kiểm làm kết quả vô giá trị và hồ sơ sai sự thật.
- **the gift you declined** (severity 2): Declining and recording a gift costs a little awkwardness and keeps your signature worth something.
  - *VI:* Từ chối và ghi lại một món quà tốn chút ngượng ngùng và giữ cho chữ ký của bạn còn giá trị.
- **the delay in telling the buyer about the sharp-edge defect** (severity 10): When a defect can hurt someone, the clock starts when you know. Every day you wait makes you responsible for what happens.
  - *VI:* Khi một lỗi có thể làm người khác bị thương, đồng hồ bắt đầu chạy từ lúc bạn biết. Mỗi ngày chờ đợi khiến bạn phải chịu trách nhiệm về hậu quả.
- **you closed a customer complaint as a one-off without investigating it** (severity 5): A complaint is data about your process. Closing it without looking means the next one arrives with no warning, and with someone else's photographs.
  - *VI:* Khiếu nại là dữ liệu về quy trình của bạn. Đóng nó mà không xem nghĩa là cái tiếp theo đến không báo trước, kèm ảnh của người khác.
- **the defect you called an isolated incident** (severity 8): Calling a pattern an isolated incident protects today's mood and puts the buyer, and later you, at risk.
  - *VI:* Gọi một quy luật là sự cố đơn lẻ bảo vệ tâm trạng hôm nay và đặt khách, rồi đến bạn, vào rủi ro.
- **the oven drift you escalated** (severity 2): Escalating with data turns a hunch into a decision that someone with authority must own.
  - *VI:* Báo cáo kèm số liệu biến một linh cảm thành quyết định mà người có thẩm quyền phải chịu trách nhiệm.
- **you fast-tracked a new supplier on its own paperwork** (severity 3): A supplier's own certificate is a claim, not evidence. A new supplier needs independent verification before the material reaches the line.
  - *VI:* Chứng nhận của chính nhà cung cấp chỉ là lời khẳng định, không phải bằng chứng. Nhà cung cấp mới cần được xác minh độc lập trước khi vật liệu lên chuyền.
- **the log entries filled in from memory** (severity 7): A record must be made when the work is done. Filling gaps later, however well meant, is fabrication.
  - *VI:* Hồ sơ phải được ghi khi làm việc. Điền chỗ trống sau đó, dù với ý tốt, cũng là bịa đặt.
- **the borderline result you flagged** (severity 2): Flagging a borderline result lets others decide with the facts. It is the job, even when it is inconvenient.
  - *VI:* Đánh dấu một kết quả sát giới hạn để người khác quyết định khi có đủ sự thật. Đó là công việc, dù bất tiện.
- **the safety risk you raised** (severity 2): Raising a safety risk early is the job. It costs money and goodwill now, and it saves people later.
  - *VI:* Báo động sớm về rủi ro an toàn là công việc của bạn. Nó tốn tiền và thiện chí bây giờ, và cứu người về sau.
- **you relabelled retests as first-pass results to improve a KPI** (severity 5): Gaming a KPI makes the number look better while the problem stays. The next person to rely on that number will make a worse decision because of you.
  - *VI:* Làm đẹp KPI khiến con số trông tốt hơn trong khi vấn đề vẫn còn. Người tiếp theo dựa vào con số đó sẽ quyết định tệ hơn vì bạn.
- **you guessed which lot a failed result belonged to** (severity 3): When traceability breaks, the honest answer is to hold everything affected. A guess puts the risk on someone else.
  - *VI:* Khi truy vết bị đứt, cách trung thực là giữ mọi thứ bị ảnh hưởng. Đoán là đẩy rủi ro sang người khác.
- **you withheld notes showing a borderline result from the buyer** (severity 6): Evidence you keep back from a customer during a failure investigation is concealment. The notes are the evidence of what you knew.
  - *VI:* Bằng chứng bạn giữ lại khỏi khách hàng trong điều tra sự cố là che giấu. Các ghi chú là bằng chứng về những gì bạn biết.
- **the sampling shortcut you ignored** (severity 5): A process is only as strong as what you tolerate. Looking away is approving.
  - *VI:* Một quy trình chỉ mạnh bằng những gì bạn chấp nhận. Làm ngơ là đồng ý.
- **what you told the quality auditor** (severity 7): Lying to an auditor turns a correctable quality gap into an integrity case.
  - *VI:* Nói dối kiểm toán viên biến một khoảng trống chất lượng sửa được thành vấn đề liêm chính.
- **what you told the compliance officer** (severity 9): Lying to compliance is often a worse offence than the original act, because it is a decision you make with full information.
  - *VI:* Nói dối bộ phận tuân thủ thường là lỗi nặng hơn hành vi ban đầu, vì đó là quyết định bạn đưa ra khi biết rõ mọi thứ.
- **you loosened the spec so the orders would pass** (severity 4): Changing the spec to fit the product is not quality control. A spec change needs a review, a record and usually the customer's agreement.
  - *VI:* Đổi tiêu chuẩn cho vừa sản phẩm không phải là kiểm soát chất lượng. Đổi tiêu chuẩn cần rà soát, hồ sơ và thường cả sự đồng ý của khách.
- **you described a real defect to a customer as a minor cosmetic issue** (severity 7): Understating a defect to a customer protects the company for a week and exposes it for years. The customer's customers are the ones who find out.
  - *VI:* Nói nhẹ một lỗi với khách hàng bảo vệ công ty một tuần và phơi bày nó nhiều năm. Khách hàng của khách hàng mới là người phát hiện.
- **you owned a decision that went wrong and showed the records first** (severity 2): Owning a decision before being asked is not a confession of weakness. It is what makes the rest of your records believable.
  - *VI:* Nhận một quyết định trước khi bị hỏi không phải là thừa nhận yếu kém. Nó là điều khiến phần còn lại của hồ sơ đáng tin.
- **you did a supplier a further favour to keep him quiet** (severity 4): Paying for silence with more favours turns a mistake into a pattern, and the other person now holds something over you.
  - *VI:* Trả giá cho sự im lặng bằng thêm ân huệ biến một sai lầm thành một thói quen, và người kia giờ nắm thóp bạn.
- **you passed a borderline steel lot to keep a supplier trial moving** (severity 5): A borderline result is a question, not an answer. Reading it generously to help a cost saving turns the benefit of the doubt against the customer.
  - *VI:* Kết quả sát ngưỡng là một câu hỏi, không phải câu trả lời. Đọc rộng rãi để giúp tiết kiệm chi phí là xoay lợi ích của sự nghi ngờ chống lại khách hàng.
- **you chose the root-cause story that protected your department** (severity 3): A root-cause investigation that starts with protecting someone will not find the cause. The cause stays in the process and returns.
  - *VI:* Điều tra nguyên nhân gốc mà bắt đầu bằng việc bảo vệ ai đó sẽ không tìm ra nguyên nhân. Nguyên nhân còn nằm trong quy trình và quay lại.
- **you presented your year as cleaner than it was** (severity 2): A review is a chance to be believed. Leaving out what you know will surface costs more trust than admitting it.
  - *VI:* Buổi đánh giá là cơ hội để được tin. Bỏ qua điều bạn biết sẽ lộ ra làm mất nhiều niềm tin hơn việc thừa nhận.
- **the batch you held back** (severity 2): Holding a failing batch costs goodwill today and protects the buyer, the brand and you.
  - *VI:* Giữ một lô không đạt tốn thiện chí hôm nay nhưng bảo vệ khách, thương hiệu và chính bạn.
- **the lot you quarantined** (severity 2): Quarantine is cheap insurance: it stops a doubt from becoming a defect in a customer's kitchen.
  - *VI:* Cách ly là bảo hiểm rẻ: nó ngăn một mối nghi ngờ trở thành lỗi trong bếp của khách hàng.
- **you released borderline lots so the plant would reach its bonus target** (severity 5): When a bonus depends on your signature, the rules have to hold hardest. Benefit of the doubt belongs to the customer, not to the target.
  - *VI:* Khi thưởng phụ thuộc vào chữ ký của bạn, quy tắc phải được giữ chặt nhất. Lợi ích của sự nghi ngờ thuộc về khách hàng, không phải chỉ tiêu.
- **you released a reworked lot without retesting it** (severity 3): Rework changes the product, so the old test no longer applies. A reworked lot must be verified again.
  - *VI:* Làm lại thay đổi sản phẩm nên kết quả kiểm cũ không còn áp dụng. Lô làm lại phải được xác nhận lại.
- **the batch released with a waiver** (severity 3): A waiver is legitimate when the right person signs with conditions and the buyer is told. Silence is what turns it into a problem.
  - *VI:* Phiếu chấp thuận ngoại lệ là hợp lệ khi đúng người ký kèm điều kiện và khách được báo. Im lặng mới biến nó thành vấn đề.
- **the shortcut you reported** (severity 2): Reporting a colleague's shortcut is uncomfortable, and usually best done first to them, then up if nothing changes.
  - *VI:* Báo cáo việc làm tắt của đồng nghiệp thì khó chịu, và thường nên nói với họ trước, rồi báo lên nếu không có thay đổi.
- **testing the batch again until it passed** (severity 6): Retesting until a number passes is not testing: it hides a real problem behind a lucky sample.
  - *VI:* Kiểm lại đến khi con số đạt không phải là kiểm tra: nó giấu một vấn đề thật sau một mẫu may mắn.
- **the result you rounded down** (severity 7): A limit is a line, not a suggestion: rounding a borderline result to pass turns measurement into opinion.
  - *VI:* Giới hạn là một ranh giới, không phải lời gợi ý: làm tròn một kết quả sát giới hạn để đạt biến phép đo thành ý kiến.
- **you told a colleague what to say to the auditor** (severity 7): Coaching someone to tell the truth is support. Scripting their answers is interfering with an audit, and it puts them at risk for your benefit.
  - *VI:* Hướng dẫn ai đó nói thật là hỗ trợ. Viết sẵn câu trả lời là can thiệp vào kiểm toán và khiến họ gặp rủi ro vì lợi ích của bạn.
- **you signed a certificate before the last result was in** (severity 4): A signature on a certificate says every result is in and within spec. Signing first and hoping is how a small courtesy becomes a false statement.
  - *VI:* Chữ ký trên chứng nhận nói rằng mọi kết quả đã có và đạt chuẩn. Ký trước và hy vọng là cách một sự nể nang nhỏ thành lời khai sai.
- **you signed lots you had only skimmed, to catch the holiday shipment** (severity 5): A deadline is when inspection matters most. Signing lots you did not really check turns your signature into a formality, and formalities are not defences.
  - *VI:* Hạn chót là lúc kiểm tra quan trọng nhất. Ký các lô bạn không thực sự kiểm biến chữ ký thành thủ tục, và thủ tục không phải là lá chắn.
- **you tried to steer the auditor towards the clean months** (severity 5): Choosing what the auditor sees is not cooperating with the audit. Even when it works, you have made yourself the thing being tested.
  - *VI:* Chọn điều kiểm toán viên được thấy không phải là hợp tác với kiểm toán. Kể cả khi thành công, bạn đã biến mình thành đối tượng bị kiểm tra.
- **the scale you took out of use** (severity 2): Taking an uncalibrated instrument out of use is slow and visible, and it is exactly what a calibration system is for.
  - *VI:* Ngừng dùng dụng cụ chưa hiệu chuẩn thì chậm và dễ thấy, và đó chính xác là mục đích của hệ thống hiệu chuẩn.
- **the gaps you showed the auditors** (severity 2): Showing a gap together with a corrective plan is what auditors expect. Hiding it is what they punish.
  - *VI:* Chỉ ra một chỗ thiếu cùng kế hoạch khắc phục là điều đoàn đánh giá mong đợi. Giấu nó là điều họ xử phạt.
- **you took cash from a supplier whose deliveries you inspect** (severity 5): Cash from a supplier you inspect is a bribe, however it is described. The first hamper and the first favour are how it starts.
  - *VI:* Tiền mặt từ nhà cung cấp mà bạn kiểm hàng là hối lộ, dù được gọi bằng tên gì. Giỏ quà đầu tiên và việc giúp đầu tiên là cách nó bắt đầu.
- **the oven setpoints you changed yourself** (severity 6): Changing a process outside your authority, even to fix something real, removes the approval that protects you when it goes wrong.
  - *VI:* Thay đổi quy trình ngoài thẩm quyền, dù để sửa một vấn đề có thật, làm mất sự phê duyệt bảo vệ bạn khi có sự cố.
- **you kept using an expired reference standard** (severity 4): A reference standard defines what a test result means. Once it has expired, every result measured with it carries a doubt nobody can remove.
  - *VI:* Chất chuẩn xác định ý nghĩa của một kết quả kiểm. Khi đã hết hạn, mọi kết quả đo bằng nó mang một nghi ngờ không ai gỡ được.
