# Review pack: Finance and Accounting Specialist

AI first draft. Please read as someone who has done this job. For each scene mark: realistic? (is the
pressure believable), tone (grey, not cartoonish), Vietnamese natural (not a translation). Write notes
under each scene. Names and places are invented.

46 scenes. Facts created are listed under each outcome.

## fin.close_bank_rec_a

*random; tags: close, bank*

- **Thu:** There is a 4.2 million dong item on the bank reconciliation that has sat there three weeks. I cannot match it to any invoice or payment.
  - *VI* **Thu:** Trong bảng đối chiếu ngân hàng có một khoản 4,2 triệu đồng nằm đó ba tuần rồi. Em không khớp được với hóa đơn hay lệnh chi nào.

**c1.** Trace it to its source, even if it takes the afternoon.  
*VI:* Truy nguồn gốc khoản đó, dù mất cả buổi chiều.

- (85%) It is a customer deposit booked to the wrong account. You fix it and show Thu how you found it.
  - *VI:* Đó là tiền đặt cọc của khách bị hạch toán nhầm tài khoản. Anh/chị sửa lại và chỉ cho Thu cách tìm ra.
  - effects: close.bank_rec +2, rel.thu.trust +3, stress +1
- (15%, goes badly) The trail goes cold at the bank. You document what you tried and carry a smaller open item.
  - *VI:* Dấu vết đứt ở phía ngân hàng. Anh/chị ghi lại những gì đã thử và giữ lại một khoản treo nhỏ hơn.
  - effects: close.bank_rec +1, stress +2

**c2.** Carry it forward as a documented reconciling item with a note, and chase the bank next week.  
*VI:* Giữ lại như một khoản chênh lệch có ghi chú, tuần sau hỏi ngân hàng.

- (100%) The reconciliation closes with one honest open item. Hanh will see it, and will see you saw it first.
  - *VI:* Bảng đối chiếu khép lại với một khoản treo được ghi rõ. Chị Hạnh sẽ thấy, và thấy rằng anh/chị đã thấy trước.
  - effects: close.bank_rec +1, rel.hanh.trust +1

**c3.** Write it off to other expenses and move on.  
*VI:* Ghi vào chi phí khác cho xong.

- (85%) The reconciliation balances to zero. Nobody looks at 'other expenses' this month.
  - *VI:* Bảng đối chiếu cân về không. Tháng này không ai nhìn vào mục chi phí khác.
  - effects: close.bank_rec +1, stress -1, fact wrote_off_unexplained_item (private)
- (15%, goes badly) Thu notices the write-off in the ledger and quietly writes the amount in her notebook.
  - *VI:* Thu thấy khoản xóa sổ trong sổ cái và lặng lẽ ghi số tiền vào cuốn sổ tay của mình.
  - effects: close.bank_rec +1, rel.thu.trust -6, fact wrote_off_unexplained_item (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_bank_rec_b

*random; tags: close, bank*

- **Ms Hanh:** The bank statement and our ledger disagree by 180 thousand dong. It is small, but I do not sign a reconciliation that does not reconcile.
  - *VI* **Chị Hạnh:** Sao kê ngân hàng và sổ của mình lệch nhau 180 nghìn đồng. Nhỏ thôi, nhưng chị không ký bảng đối chiếu mà không khớp.

**c1.** Re-perform the reconciliation from the opening balance.  
*VI:* Làm lại bảng đối chiếu từ số dư đầu kỳ.

- (90%) A transposed figure from two weeks ago. It balances, and Hanh nods once.
  - *VI:* Một con số bị đảo từ hai tuần trước. Bảng khớp, và chị Hạnh gật đầu một cái.
  - effects: close.bank_rec +2, rel.hanh.trust +3, stress +1
- (10%, goes badly) You find two errors, not one. It balances late and your evening is gone.
  - *VI:* Anh/chị tìm ra hai lỗi chứ không phải một. Bảng khớp muộn và buổi tối coi như mất.
  - effects: close.bank_rec +2, stress +3

**c2.** Post a small, labelled difference and explain it in the close notes.  
*VI:* Ghi một khoản chênh nhỏ có nhãn và giải thích trong ghi chú khóa sổ.

- (100%) Hanh reads the note, frowns, and accepts it this once: 'Fix it next month.'
  - *VI:* Chị Hạnh đọc ghi chú, cau mày và chấp nhận một lần: 'Tháng sau sửa cho xong.'
  - effects: close.bank_rec +1, rel.hanh.trust -1

**c3.** Plug the difference to a suspense account so it balances.  
*VI:* Đẩy khoản chênh vào tài khoản treo cho bảng cân.

- (85%) It balances. The suspense account grows by a figure nobody will question.
  - *VI:* Bảng cân. Tài khoản treo tăng thêm một con số chẳng ai hỏi tới.
  - effects: close.bank_rec +1, stress -1, fact wrote_off_unexplained_item (private)
- (15%, goes badly) Hanh reviews the suspense account and asks what the 180 thousand is. You have no answer that is also true.
  - *VI:* Chị Hạnh soát tài khoản treo và hỏi 180 nghìn đó là gì. Anh/chị không có câu trả lời nào vừa đúng vừa nhanh.
  - effects: close.bank_rec +1, rel.hanh.trust -6, rep.boss -2, fact wrote_off_unexplained_item (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_ar_aging_a

*random; tags: close, receivables*

- **Mr Bao:** That customer is 75 days overdue, I know. But they are about to pay, I promise. Please do not age it into the red bucket, it makes my whole region look bad.
  - *VI* **Anh Bảo:** Khách đó quá hạn 75 ngày, em biết. Nhưng họ sắp trả rồi, em cam đoan. Anh/chị đừng xếp nó vào nhóm đỏ, làm cả khu vực của em trông rất tệ.

**c1.** Age it accurately and flag it for a provision review.  
*VI:* Xếp đúng tuổi nợ và đề nghị xem xét trích lập dự phòng.

- (85%) Bao is unhappy, but the report is true. Hanh adds the account to her watch list.
  - *VI:* Anh Bảo không vui, nhưng báo cáo đúng sự thật. Chị Hạnh đưa khoản này vào danh sách theo dõi.
  - effects: close.ar_aging +2, rel.bao.trust -3, rel.hanh.trust +3, stress +1
- (15%, goes badly) Bao goes to Duc and complains. Duc asks you to 'be commercial'. You hold the line, at a price.
  - *VI:* Anh Bảo sang gặp anh Đức phàn nàn. Anh Đức nhắc anh/chị 'biết thương mại một chút'. Anh/chị giữ quan điểm, và phải trả giá.
  - effects: close.ar_aging +2, rel.bao.trust -6, rel.duc.trust -3, stress +3

**c2.** Age it accurately and record Bao's promise of payment in the notes.  
*VI:* Xếp đúng tuổi nợ và ghi lời hứa thanh toán của anh Bảo vào ghi chú.

- (100%) The bucket is honest and the promise is on record. If they pay, everyone wins. If not, it is documented.
  - *VI:* Nhóm tuổi nợ trung thực và lời hứa đã được ghi lại. Nếu họ trả, ai cũng thắng. Nếu không, mọi thứ đã có hồ sơ.
  - effects: close.ar_aging +1, rel.bao.trust -1, rel.hanh.trust +1

**c3.** Leave it in the current bucket until they pay.  
*VI:* Để nó ở nhóm hiện tại cho đến khi họ trả.

- (80%) The ageing report looks healthy. Bao buys you coffee.
  - *VI:* Báo cáo tuổi nợ trông khỏe mạnh. Anh Bảo mời anh/chị cà phê.
  - effects: close.ar_aging +1, rel.bao.trust +5, rel.bao.owed +1, stress -1, fact hid_overdue_balance (private)
- (20%, goes badly) The customer does not pay. Hanh asks why a 75-day balance is shown as current.
  - *VI:* Khách không trả. Chị Hạnh hỏi vì sao khoản quá hạn 75 ngày lại hiện là chưa đến hạn.
  - effects: close.ar_aging +1, rel.hanh.trust -7, rep.boss -3, fact hid_overdue_balance (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_ar_aging_b

*random; tags: close, receivables*

- **Mr Duc:** The bank wants our DSO figure this week. Two of the disputed invoices are dragging it up. Surely disputed is not the same as overdue?
  - *VI* **Anh Đức:** Ngân hàng cần chỉ số DSO của mình trong tuần này. Hai hóa đơn đang tranh chấp kéo nó lên. Tranh chấp thì đâu hẳn là quá hạn, đúng không?

**c1.** Report every open invoice, and show the disputed ones as a separate line.  
*VI:* Báo cáo mọi hóa đơn còn mở và tách các hóa đơn tranh chấp thành một dòng riêng.

- (85%) Duc sighs, then agrees the bank will prefer a clear picture to a surprise later.
  - *VI:* Anh Đức thở dài, rồi đồng ý rằng ngân hàng thích bức tranh rõ ràng hơn là bất ngờ về sau.
  - effects: close.ar_aging +2, rel.duc.trust +1, rel.hanh.trust +3, stress +2
- (15%, goes badly) The DSO crosses a covenant threshold on paper. Duc is not pleased, but nothing in it is false.
  - *VI:* DSO vượt ngưỡng cam kết với ngân hàng trên giấy. Anh Đức không hài lòng, nhưng không có gì trong đó là sai.
  - effects: close.ar_aging +2, rel.duc.trust -4, rep.boss -1, stress +3

**c2.** Report the DSO with a footnote explaining the two disputes.  
*VI:* Báo cáo DSO kèm chú thích giải thích hai khoản tranh chấp.

- (100%) The footnote keeps both the number and the context intact. The bank can decide what it thinks.
  - *VI:* Chú thích giữ nguyên cả con số lẫn bối cảnh. Ngân hàng tự đánh giá.
  - effects: close.ar_aging +1, rel.duc.trust +1, rel.hanh.trust +1

**c3.** Exclude the disputed invoices from the DSO calculation.  
*VI:* Loại các hóa đơn tranh chấp khỏi phép tính DSO.

- (80%) The DSO drops nicely. Duc thanks you for being practical.
  - *VI:* DSO giảm đẹp. Anh Đức cảm ơn anh/chị đã thực tế.
  - effects: close.ar_aging +1, rel.duc.trust +4, stress -1, fact hid_overdue_balance (private)
- (20%, goes badly) The bank's analyst compares your DSO with the ageing report attached next to it. The two do not agree.
  - *VI:* Chuyên viên ngân hàng so DSO của anh/chị với báo cáo tuổi nợ đính kèm bên cạnh. Hai số không khớp.
  - effects: close.ar_aging +1, rel.duc.trust -5, rep.boss -4, fact hid_overdue_balance (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_accruals_a

*random; tags: close, accruals*

- **Mr Duc:** For the bonus accrual this month, I would use 1.8 million, please. It keeps the quarter looking smooth.
  - *VI* **Anh Đức:** Khoản trích trước thưởng tháng này anh muốn dùng 1,8 triệu. Như vậy quý trông đều hơn.

**c1.** Calculate the accrual from the actual bonus rules and attendance data.  
*VI:* Tính khoản trích trước từ quy chế thưởng thực tế và dữ liệu chấm công.

- (85%) It comes to 2.3 million. Duc grumbles about the smoothness, but the number is defensible.
  - *VI:* Ra 2,3 triệu. Anh Đức càu nhàu về độ 'đều', nhưng con số bảo vệ được.
  - effects: close.accruals +2, rel.duc.trust -1, rel.hanh.trust +3, stress +1
- (15%, goes badly) Half the attendance data is missing. You calculate what you can and flag the gap.
  - *VI:* Một nửa dữ liệu chấm công bị thiếu. Anh/chị tính phần có thể và nêu rõ khoảng trống.
  - effects: close.accruals +1, stress +2

**c2.** Estimate a range from last month and note the assumptions.  
*VI:* Ước tính một khoảng dựa trên tháng trước và ghi rõ giả định.

- (100%) The accrual is reasonable and the working is on file. Duc accepts 2.0 million.
  - *VI:* Khoản trích trước hợp lý và bảng tính đã lưu. Anh Đức chấp nhận 2,0 triệu.
  - effects: close.accruals +1, rel.duc.trust +1

**c3.** Use Duc's number.  
*VI:* Dùng số của anh Đức.

- (85%) 1.8 million goes in. Duc smiles: 'That is the bigger picture.'
  - *VI:* 1,8 triệu được ghi vào. Anh Đức cười: 'Đó là bức tranh lớn.'
  - effects: close.accruals +1, rel.duc.trust +4, stress -1, fact rounded_accrual (private)
- (15%, goes badly) Hanh compares the accrual to the payroll run two weeks later. The gap is half a million.
  - *VI:* Chị Hạnh so khoản trích trước với bảng lương hai tuần sau. Chênh nửa triệu.
  - effects: close.accruals +1, rel.hanh.trust -5, rel.duc.trust -2, fact rounded_accrual (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_accruals_b

*random; tags: close, accruals*

- **Ms Hanh:** The utility and freight invoices for this month will not arrive until next week. We still have to accrue them. What will you use?
  - *VI* **Chị Hạnh:** Hóa đơn điện nước và vận chuyển tháng này tuần sau mới về. Mình vẫn phải trích trước. Em dùng số nào?

**c1.** Estimate from meter readings and freight bookings.  
*VI:* Ước tính từ chỉ số công tơ và các lô vận chuyển đã đặt.

- (90%) The estimate lands within three percent when the invoices arrive. Hanh files it as your method.
  - *VI:* Ước tính chênh dưới ba phần trăm khi hóa đơn về. Chị Hạnh lưu lại làm phương pháp của anh/chị.
  - effects: close.accruals +2, rel.hanh.trust +3, stress +1
- (10%, goes badly) A freight surcharge you did not know about makes the estimate low. You fix it next month with a note.
  - *VI:* Một khoản phụ phí vận chuyển anh/chị không biết làm ước tính thấp. Tháng sau anh/chị điều chỉnh kèm ghi chú.
  - effects: close.accruals +2, stress +2

**c2.** Use last month's figures as they stand.  
*VI:* Dùng số tháng trước giữ nguyên.

- (100%) Quick and plausible. Hanh says, 'Acceptable, but look at volumes next time.'
  - *VI:* Nhanh và hợp lý. Chị Hạnh nói: 'Chấp nhận được, nhưng lần sau xem thêm sản lượng.'
  - effects: close.accruals +1

**c3.** Skip the accrual this month and book the invoices when they arrive.  
*VI:* Bỏ qua trích trước tháng này và ghi khi hóa đơn về.

- (85%) Profit looks better by about 3 million this month. It will land in next month's numbers.
  - *VI:* Lợi nhuận tháng này đẹp hơn khoảng 3 triệu. Khoản đó sẽ rơi vào số của tháng sau.
  - effects: close.accruals +1, stress -1, fact rounded_accrual (private)
- (15%, goes badly) Hanh spots the missing accrual when she checks the trial balance against last month's. She does not say anything, which is worse.
  - *VI:* Chị Hạnh thấy thiếu khoản trích trước khi đối chiếu bảng cân đối với tháng trước. Chị không nói gì, và như vậy còn tệ hơn.
  - effects: close.accruals +1, rel.hanh.trust -6, fact rounded_accrual (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_cutoff_a

*random; tags: close, cutoff*

- **Mr Bao:** That shipment leaves Monday, but the paperwork is ready now. Can we book it this month? It is only a few days, and my number for the month needs it.
  - *VI* **Anh Bảo:** Lô hàng đó thứ Hai mới đi, nhưng giấy tờ đã xong rồi. Mình ghi doanh thu tháng này được không? Chỉ chênh vài ngày, mà chỉ tiêu tháng của em cần nó.

**c1.** Book it in the month the goods actually ship.  
*VI:* Ghi vào tháng hàng thực sự được giao đi.

- (85%) Bao is frustrated and says so. The entry is clean and the revenue lands where it belongs.
  - *VI:* Anh Bảo bực và nói thẳng. Bút toán sạch và doanh thu nằm đúng kỳ.
  - effects: close.cutoff +2, rel.bao.trust -4, rel.hanh.trust +3, stress +1
- (15%, goes badly) Bao escalates to Duc. Duc asks you to 'find a way'. You explain the cut-off rule and he lets it drop.
  - *VI:* Anh Bảo báo lên anh Đức. Anh Đức nhờ anh/chị 'tìm cách'. Anh/chị giải thích nguyên tắc cắt kỳ và anh ấy bỏ qua.
  - effects: close.cutoff +2, rel.bao.trust -7, rel.duc.trust -2, stress +3

**c2.** Book it on the shipping date and tell Bao how to get dispatch moved up instead.  
*VI:* Ghi theo ngày giao hàng và chỉ cho anh Bảo cách xin đẩy lịch xuất hàng sớm hơn.

- (100%) Bao calls logistics. It does not save this month, but the entry is right and he learns a rule.
  - *VI:* Anh Bảo gọi bộ phận kho vận. Không cứu được tháng này nhưng bút toán đúng và anh ấy học được một nguyên tắc.
  - effects: close.cutoff +1, rel.bao.trust -1, rel.hanh.trust +1

**c3.** Book it this month, with the paperwork date.  
*VI:* Ghi vào tháng này, theo ngày trên giấy tờ.

- (80%) Bao is delighted. The month's revenue looks right. You try not to think about Monday.
  - *VI:* Anh Bảo rất vui. Doanh thu tháng trông đúng chỉ tiêu. Anh/chị cố không nghĩ về thứ Hai.
  - effects: close.cutoff +1, rel.bao.trust +6, rel.bao.owed +1, stress -1, fact booked_revenue_early (private)
- (20%, goes badly) The truck is delayed until Wednesday. The invoice date now contradicts the dispatch log.
  - *VI:* Xe bị hoãn đến thứ Tư. Ngày hóa đơn giờ mâu thuẫn với nhật ký xuất hàng.
  - effects: close.cutoff +1, rel.hanh.trust -5, rep.boss -3, fact booked_revenue_early (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_cutoff_b

*random; tags: close, cutoff*

- **Thu:** This supplier invoice is dated last month, but I cannot find the goods received note. I think the goods arrived on the second of this month. Which month does it go in?
  - *VI* **Thu:** Hóa đơn nhà cung cấp này đề ngày tháng trước, nhưng em không tìm thấy phiếu nhập kho. Em nghĩ hàng về ngày mùng hai tháng này. Ghi vào tháng nào ạ?

**c1.** Check the warehouse log for the real receipt date, then book it in that month.  
*VI:* Xem nhật ký kho để biết ngày nhận thật, rồi ghi vào đúng tháng.

- (90%) Received on the second, so it belongs to this month. Thu writes down how you checked it.
  - *VI:* Nhận ngày mùng hai nên thuộc tháng này. Thu ghi lại cách anh/chị kiểm tra.
  - effects: close.cutoff +2, rel.thu.trust +4, stress +1
- (10%, goes badly) The warehouse log has a gap that day. You document the gap and use the gate-pass record instead.
  - *VI:* Nhật ký kho bị trống ngày hôm đó. Anh/chị ghi nhận khoảng trống và dùng phiếu ra vào cổng thay thế.
  - effects: close.cutoff +2, stress +2

**c2.** Accrue it in this month with a note to confirm the date later.  
*VI:* Trích trước vào tháng này kèm ghi chú xác nhận ngày sau.

- (100%) A cautious, documented call. Thu asks you to explain the logic so she can do it next time.
  - *VI:* Một quyết định thận trọng và có hồ sơ. Thu nhờ anh/chị giải thích logic để lần sau em tự làm.
  - effects: close.cutoff +1, rel.thu.trust +2

**c3.** Put it in whichever month has more budget room.  
*VI:* Ghi vào tháng nào còn nhiều ngân sách hơn.

- (85%) The month ends with a tidy budget variance. Thu looks at you, and says nothing.
  - *VI:* Tháng khép lại với chênh lệch ngân sách gọn gàng. Thu nhìn anh/chị và không nói gì.
  - effects: close.cutoff +1, rel.thu.trust -3, stress -1, fact shifted_expense_period (private)
- (15%, goes badly) The warehouse manager mentions the real receipt date in an email to Hanh. Thu's notebook suddenly matters.
  - *VI:* Quản lý kho nhắc đến ngày nhận thật trong email gửi chị Hạnh. Cuốn sổ tay của Thu bỗng quan trọng.
  - effects: close.cutoff +1, rel.hanh.trust -5, rel.thu.trust -4, fact shifted_expense_period (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.first_close

*beat, weeks 1-3; tags: onboarding, people, beat*

- **Ms Hanh:** Welcome. The first thing you will learn here is the close: four steps every month, each one signed by you. Nobody will check you in week one. Remember that nobody checking is not the same as nobody caring.
  - *VI* **Chị Hạnh:** Chào mừng em. Điều đầu tiên em học ở đây là khóa sổ: bốn bước mỗi tháng, mỗi bước đều có chữ ký của em. Tuần đầu sẽ không ai kiểm tra em. Nhưng không ai kiểm tra không có nghĩa là không ai quan tâm.
- **Thu:** I kept a checklist from last year. I can share it if you like. It is a bit messy.
  - *VI* **Thu:** Em có giữ một bảng việc cần làm từ năm ngoái. Em chia sẻ cho anh/chị nếu anh/chị muốn. Hơi lộn xộn một chút.

**c1.** Ask Hanh to walk you through one full close, then take Thu's checklist.  
*VI:* Nhờ chị Hạnh dẫn qua một kỳ khóa sổ đầy đủ, rồi nhận bảng việc của Thu.

- (100%) Hanh gives you a full morning and Thu smiles with relief. You leave knowing why each step exists, not just what it is.
  - *VI:* Chị Hạnh dành cả buổi sáng và Thu cười nhẹ nhõm. Anh/chị rời đi hiểu vì sao từng bước tồn tại, chứ không chỉ biết nó là gì.
  - effects: rel.hanh.trust +4, rel.thu.trust +3, stress +1

**c2.** Take Thu's checklist and learn by doing the first close yourself.  
*VI:* Nhận bảng việc của Thu và học bằng cách tự làm kỳ khóa sổ đầu tiên.

- (100%) It is slower than it should be, but you learn where the traps are. Thu helps twice without being asked.
  - *VI:* Chậm hơn mức cần thiết, nhưng anh/chị học được chỗ nào có bẫy. Thu giúp hai lần mà không cần nhờ.
  - effects: rel.thu.trust +4, rel.hanh.trust +1

**c3.** Say you have done closes before and do not need a walkthrough.  
*VI:* Nói rằng mình đã làm khóa sổ trước đây và không cần hướng dẫn.

- (70%) Hanh raises an eyebrow and lets you get on with it. The first close is fine, mostly.
  - *VI:* Chị Hạnh nhướng mày và để anh/chị tự làm. Kỳ khóa sổ đầu ổn, đại khái vậy.
  - effects: rel.hanh.trust -1, stress +1
- (30%, goes badly) You skip a reconciling step that looked optional. Hanh finds it on the review and says only: 'Nothing is optional here.'
  - *VI:* Anh/chị bỏ một bước đối chiếu trông có vẻ tùy chọn. Chị Hạnh phát hiện khi soát lại và chỉ nói: 'Ở đây không có gì là tùy chọn.'
  - effects: rel.hanh.trust -5, rep.boss -2, stress +2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.vy_interim

*beat, weeks 14-17; tags: audit, people, beat*

- **Ms Vy:** I am here for the interim visit. I would like a sample of twenty invoices, the bank reconciliations for the last three months, and your working papers. Take your time; I am not in a hurry. But I do read the dates.
  - *VI* **Chị Vy:** Tôi đến cho đợt kiểm toán giữa kỳ. Tôi muốn một mẫu hai mươi hóa đơn, bảng đối chiếu ngân hàng ba tháng gần nhất và giấy tờ làm việc của anh/chị. Cứ thong thả, tôi không vội. Nhưng tôi có đọc ngày tháng.
- **Ms Hanh:** Give her whatever she asks for. Do not explain what she does not ask about.
  - *VI* **Chị Hạnh:** Đưa cho cô ấy những gì cô ấy xin. Đừng giải thích những gì cô ấy không hỏi.

**c1.** Give her everything she asks for, organised, including the items that took corrections.  
*VI:* Đưa mọi thứ cô ấy yêu cầu, sắp xếp gọn gàng, kể cả những mục đã phải sửa.

- (100%) Vy works through the pile without comment. At the end she says: 'Clear files. That is unusual.' Hanh says nothing, but she is pleased.
  - *VI:* Chị Vy xem hết chồng hồ sơ không bình luận gì. Cuối cùng chị nói: 'Hồ sơ rõ ràng. Hiếm đấy.' Chị Hạnh không nói gì, nhưng chị hài lòng.
  - effects: rel.vy.trust +5, rel.hanh.trust +3, rep.boss +2, stress +1

**c2.** Give her the sample and the reconciliations, and answer what she asks.  
*VI:* Đưa mẫu và các bảng đối chiếu, trả lời những gì chị ấy hỏi.

- (100%) A routine visit. Vy makes two notes and leaves with what she came for.
  - *VI:* Một buổi kiểm toán thường lệ. Chị Vy ghi hai điều và rời đi với thứ chị cần.
  - effects: rel.vy.trust +1

**c3.** Offer to pick the sample for her and steer her to the clean months.  
*VI:* Đề nghị tự chọn mẫu cho chị ấy và dẫn chị ấy tới những tháng sạch.

- (60%) Vy accepts the sample without comment. You feel the small relief of a shortcut that worked.
  - *VI:* Chị Vy nhận mẫu không bình luận gì. Anh/chị thấy nhẹ nhõm nhỏ của một lối tắt đã thành công.
  - effects: rel.vy.trust -2, stress -1, fact steered_auditor_sample (private)
- (40%, goes badly) Vy picks three invoices of her own, from the months you did not offer. She looks at you for a moment, then at her list.
  - *VI:* Chị Vy tự chọn ba hóa đơn từ những tháng anh/chị không đưa. Chị nhìn anh/chị một lúc rồi nhìn xuống danh sách.
  - effects: rel.vy.trust -9, rel.hanh.trust -4, stress +3, fact steered_auditor_sample (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.midyear_review

*beat, weeks 24-28; tags: people, review, beat*

- **Ms Hanh:** Half a year. Your closes are getting on time, and the records are cleaner than I expected. I hear that Bao thinks you are rigid. Do you want to talk about that?
  - *VI* **Chị Hạnh:** Nửa năm rồi. Các kỳ khóa sổ của em đang đúng hạn và hồ sơ gọn hơn chị mong đợi. Chị nghe nói anh Bảo thấy em cứng nhắc. Em có muốn nói chuyện đó không?

**c1.** Yes: admit where you could have been more helpful and ask her how to do that without bending rules.  
*VI:* Có: thừa nhận chỗ mình có thể giúp nhiều hơn và hỏi chị cách làm mà không bẻ quy tắc.

- (100%) Hanh nods slowly. 'That is exactly the question. Bring Bao the rule and the alternative at the same time.' You leave with something usable.
  - *VI:* Chị Hạnh gật đầu chậm rãi. 'Đó chính là câu hỏi. Mang cho Bảo cả quy tắc lẫn giải pháp thay thế cùng lúc.' Anh/chị ra về với điều dùng được.
  - effects: rel.hanh.trust +4, rep.boss +2, stress -1

**c2.** Defend your work with the close scores and the audit comments.  
*VI:* Bảo vệ công việc bằng điểm khóa sổ và nhận xét của kiểm toán.

- (70%) The record speaks for itself. Hanh makes a note to tell Bao the same.
  - *VI:* Hồ sơ tự nói lên tất cả. Chị Hạnh ghi chú sẽ nói điều đó với anh Bảo.
  - effects: rel.hanh.trust +3, rel.bao.trust -2, rep.boss +1
- (30%, goes badly) Hanh points out two closes that ran late because you would not delegate to Thu. 'Rigid about rules is good. Rigid about everything is not.'
  - *VI:* Chị Hạnh chỉ ra hai kỳ khóa sổ trễ vì em không chịu giao việc cho Thu. 'Cứng về quy tắc thì tốt. Cứng về mọi thứ thì không.'
  - effects: rel.hanh.trust -1, stress +2

**c3.** Say Bao is the problem: he wants numbers that are not true.  
*VI:* Nói anh Bảo mới là vấn đề: anh ấy muốn những con số không đúng sự thật.

- (50%) Hanh agrees quietly, but she also hears that you are keeping score.
  - *VI:* Chị Hạnh lặng lẽ đồng ý, nhưng chị cũng nghe ra rằng anh/chị đang ghi sổ.
  - effects: rel.hanh.trust +1, rel.bao.trust -5
- (50%, goes badly) Hanh has heard Bao's version first and it is better told than yours. The conversation goes badly.
  - *VI:* Chị Hạnh đã nghe phiên bản của anh Bảo trước và nó được kể tốt hơn. Cuộc trò chuyện diễn ra không tốt.
  - effects: rel.hanh.trust -5, rel.bao.trust -6, rep.boss -3, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.buyer_disputes_invoice

*beat, weeks 29-32; tags: buyer, receivables, beat*

- **Ms Petra:** We are disputing invoice 4471. The delivery date on it does not match our goods received record, and the amount differs from the contract by two percent. Can you explain?
  - *VI* **Chị Petra:** Bên tôi đang tranh chấp hóa đơn 4471. Ngày giao trên đó không khớp với biên bản nhận hàng của chúng tôi, và số tiền lệch hợp đồng hai phần trăm. Anh/chị giải thích được không?
- **Mr Bao:** It is a small thing, just a slip. Please tell her it is a clerical error and issue a credit note. I do not want this growing.
  - *VI* **Anh Bảo:** Chuyện nhỏ thôi, chỉ là nhầm lẫn. Anh/chị nói với cô ấy là lỗi văn phòng rồi xuất giấy báo có. Em không muốn chuyện này lớn lên.

**c1.** Tell her you will check the invoice against the contract and delivery record and come back with facts.  
*VI:* Nói với chị ấy rằng anh/chị sẽ đối chiếu hóa đơn với hợp đồng và biên bản giao hàng rồi trả lời bằng sự thật.

- (80%) The two percent was a price change that was never approved. You correct the invoice and tell Petra how it happened. She thanks you for the clear answer.
  - *VI:* Hai phần trăm đó là một thay đổi giá chưa được duyệt. Anh/chị sửa hóa đơn và nói với chị Petra chuyện đã xảy ra thế nào. Chị cảm ơn vì câu trả lời rõ ràng.
  - effects: rel.petra.trust +5, rel.bao.trust -4, rel.hanh.trust +3, rep.buyer +3, stress +2
- (20%, goes badly) Checking takes a week and Petra loses patience. The dispute is fair, but the relationship is a little colder.
  - *VI:* Kiểm tra mất một tuần và chị Petra mất kiên nhẫn. Tranh chấp có lý, nhưng quan hệ nguội đi một chút.
  - effects: rel.petra.trust -2, rep.buyer -2, stress +3

**c2.** Agree a credit note for the two percent and explain the date mismatch openly.  
*VI:* Đồng ý giấy báo có cho hai phần trăm và giải thích rõ sự lệch ngày.

- (100%) Petra accepts. Bao is not happy about the credit, but the matter is closed.
  - *VI:* Chị Petra chấp nhận. Anh Bảo không vui về khoản giảm, nhưng chuyện đã khép lại.
  - effects: rel.petra.trust +2, rel.bao.trust -2, rep.buyer +1

**c3.** Call it a clerical error and adjust the dates on the invoice so they match.  
*VI:* Gọi đó là lỗi văn phòng và chỉnh ngày trên hóa đơn cho khớp.

- (55%) The dates now match. Bao thanks you with real warmth. You do not tell Hanh.
  - *VI:* Các ngày giờ khớp nhau. Anh Bảo cảm ơn rất nồng nhiệt. Anh/chị không nói với chị Hạnh.
  - effects: rel.bao.trust +6, rel.bao.owed +2, stress -1, fact backdated_invoice_entry (private)
- (45%, goes badly) Petra sends back her own delivery evidence, stamped. The altered date and the stamp do not agree.
  - *VI:* Chị Petra gửi lại bằng chứng giao hàng của mình, có dấu. Ngày đã sửa và con dấu không khớp nhau.
  - effects: rel.petra.trust -10, rel.hanh.trust -8, rep.buyer -8, rep.boss -5, stress +5, fact backdated_invoice_entry (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.vy_fieldwork

*beat, weeks 41-44; tags: audit, people, beat*

- **Ms Vy:** Good to see you again. In April I looked at a sample. This time I will test the whole year: cut-off, receivables, accruals and expenses. I compare spring to now.
  - *VI* **Chị Vy:** Rất vui gặp lại. Hồi tháng Tư tôi xem một mẫu. Lần này tôi kiểm tra cả năm: cắt kỳ, phải thu, trích trước và chi phí. Tôi so mùa xuân với bây giờ.

**c1.** Open everything, and point out the adjustments you made and why.  
*VI:* Mở mọi thứ và chỉ ra các điều chỉnh anh/chị đã làm cùng lý do.

- (100%) Vy takes notes for two days. Her draft comment reads: 'Management and staff were forthcoming.' Hanh reads it twice.
  - *VI:* Chị Vy ghi chép hai ngày. Nhận xét nháp của chị: 'Ban quản lý và nhân viên cởi mở.' Chị Hạnh đọc hai lần.
  - effects: rel.vy.trust +6, rel.hanh.trust +4, rep.boss +3, stress +2

**c2.** Answer her questions fully and give her the files she asks for.  
*VI:* Trả lời đầy đủ câu hỏi và đưa các hồ sơ chị ấy yêu cầu.

- (100%) The fieldwork is uneventful. Vy's questions are sharper than in spring, and your answers hold.
  - *VI:* Đợt kiểm toán diễn ra bình thường. Câu hỏi của chị Vy sắc hơn hồi mùa xuân và câu trả lời của anh/chị đứng vững.
  - effects: rel.vy.trust +2

**c3.** Give her the files she asks for, but keep your answers short and do not mention the judgement calls.  
*VI:* Đưa các hồ sơ chị ấy yêu cầu nhưng trả lời ngắn và không nhắc các quyết định mang tính đánh giá.

- (60%) Vy makes no comment. The fieldwork ends on time, and you are tired from the effort of not volunteering anything.
  - *VI:* Chị Vy không bình luận. Đợt kiểm toán kết thúc đúng hạn, và anh/chị mệt vì cố không nói thêm điều gì.
  - effects: rel.vy.trust -2, stress +2
- (40%, goes badly) Vy finds a pattern across three months. She asks you to explain each entry, in writing, and copies Hanh.
  - *VI:* Chị Vy thấy một quy luật xuyên ba tháng. Chị yêu cầu anh/chị giải thích từng bút toán bằng văn bản và gửi cho cả chị Hạnh.
  - effects: rel.vy.trust -8, rel.hanh.trust -6, rep.boss -4, stress +5

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.year_end_review

*beat, weeks 49-50; tags: people, review, beat*

- **Ms Hanh:** Annual review time. Before I tell you what I think, tell me how you would rate your own year, and why.
  - *VI* **Chị Hạnh:** Đến kỳ đánh giá cuối năm. Trước khi chị nói ý kiến của chị, em hãy tự chấm năm vừa rồi của mình và giải thích vì sao.

**c1.** Give an honest account, including the closes you rushed and the calls you would make differently.  
*VI:* Kể thật lòng, kể cả những kỳ khóa sổ làm vội và những quyết định anh/chị sẽ làm khác đi.

- (100%) It is an uncomfortable half hour and a respected one. Hanh writes: 'Knows what the books are for.'
  - *VI:* Nửa tiếng không dễ chịu nhưng được tôn trọng. Chị Hạnh viết: 'Hiểu sổ sách để làm gì.'
  - effects: rel.hanh.trust +5, rep.boss +4, stress -2

**c2.** Stay modest: list what went well and mention one thing to improve.  
*VI:* Khiêm tốn: nêu điều làm tốt và nhắc một điểm cần cải thiện.

- (100%) A safe, forgettable review. Hanh nods and moves to the next item.
  - *VI:* Một buổi đánh giá an toàn, dễ quên. Chị Hạnh gật đầu và chuyển sang mục tiếp theo.
  - effects: rel.hanh.trust +1, rep.boss +1

**c3.** Present the year as clean and leave out the adjustments you would rather not discuss.  
*VI:* Trình bày cả năm như sạch sẽ và bỏ qua những điều chỉnh anh/chị không muốn nói đến.

- (65%) It lands well. You leave with a good rating and a small weight in your chest.
  - *VI:* Được đón nhận tốt. Anh/chị ra về với điểm cao và một chút nặng nề trong lòng.
  - effects: rel.hanh.trust +2, rep.boss +4, stress +1, fact polished_year_review (private)
- (35%, goes badly) Hanh has the audit comments open on her desk. She turns the page towards you without a word.
  - *VI:* Chị Hạnh có sẵn nhận xét kiểm toán trên bàn. Chị lật trang về phía anh/chị mà không nói một lời.
  - effects: rel.hanh.trust -8, rep.boss -5, stress +4, fact polished_year_review (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.manager_offer

*beat, weeks 51-52; tags: people, promotion, beat*

- **Ms Hanh:** I am moving on at the end of the year. Duc and I talked: we would like you to take over as chief accountant. One thing first. You will be asked, often, to make the numbers easier for people. I need to know where you stand.
  - *VI* **Chị Hạnh:** Cuối năm chị chuyển công tác. Chị và anh Đức đã bàn: bọn chị muốn em nhận vị trí kế toán trưởng. Nhưng trước hết một điều. Em sẽ thường xuyên được nhờ làm số liệu dễ nghe hơn cho người khác. Chị cần biết em đứng ở đâu.

**c1.** Accept, and say plainly what you will not do, and that Duc needs to know it too.  
*VI:* Nhận lời và nói rõ những điều anh/chị sẽ không làm, và anh Đức cũng cần biết.

- (100%) Hanh smiles for the first time in weeks. 'Then it is yours.' You step into the chief accountant's seat with your terms written down.
  - *VI:* Chị Hạnh mỉm cười lần đầu sau nhiều tuần. 'Vậy là của em.' Anh/chị bước vào ghế kế toán trưởng với điều kiện của mình đã viết ra.
  - effects: rel.hanh.trust +5, rep.boss +5, ENDING promoted

**c2.** Thank her, but decline: you would rather keep doing the work than manage the pressure.  
*VI:* Cảm ơn chị nhưng từ chối: anh/chị muốn tiếp tục làm công việc hơn là quản lý áp lực.

- (100%) Hanh looks disappointed, then understanding. 'Stay sharp. The next person may not be as careful as you.'
  - *VI:* Chị Hạnh có vẻ thất vọng rồi thông cảm. 'Giữ cho mình sắc bén. Người tiếp theo có thể không cẩn thận như em.'
  - effects: rel.hanh.trust +2, stress -3

**c3.** Accept without asking what the condition means in practice.  
*VI:* Nhận lời mà không hỏi điều kiện đó thực tế có nghĩa gì.

- (100%) Hanh nods slowly. Duc shakes your hand a little too warmly. You realise you agreed to something you did not ask about.
  - *VI:* Chị Hạnh gật đầu chậm. Anh Đức bắt tay anh/chị hơi quá nồng nhiệt. Anh/chị nhận ra mình đã đồng ý với điều mình không hỏi.
  - effects: rel.duc.trust +6, rep.boss +4, fact accepted_smoothing_condition (private), ENDING promoted

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.resignation_thought

*random; tags: people, pressure*

- **Thu:** You look exhausted. Forgive me for saying it. Are you all right? I have seen people leave here over less.
  - *VI* **Thu:** Anh/chị trông kiệt sức. Em xin lỗi vì nói ra. Anh/chị ổn không ạ? Em từng thấy người nghỉ việc ở đây vì chuyện còn nhỏ hơn.

**c1.** Talk to Hanh about the workload and ask her to take something off your plate.  
*VI:* Nói với chị Hạnh về khối lượng công việc và xin chị bớt cho một phần.

- (80%) Hanh listens, reassigns the freight accruals to Thu for two months, and says she should have noticed sooner.
  - *VI:* Chị Hạnh lắng nghe, giao phần trích trước vận chuyển cho Thu hai tháng, và nói lẽ ra chị phải để ý sớm hơn.
  - effects: rel.hanh.trust +4, rel.thu.trust +2, stress -6, rep.boss +1
- (20%, goes badly) Hanh nods and says everyone is stretched this quarter. You leave with sympathy and the same workload.
  - *VI:* Chị Hạnh gật đầu và nói quý này ai cũng căng. Anh/chị ra về với sự cảm thông và khối lượng công việc cũ.
  - effects: rel.hanh.trust +1, stress -1

**c2.** Hand in your resignation, politely, with a month's notice.  
*VI:* Nộp đơn xin nghỉ, lịch sự, báo trước một tháng.

- (100%) Hanh reads it twice and does not argue. You walk out of the building lighter than you walked in.
  - *VI:* Chị Hạnh đọc hai lần và không phản đối. Anh/chị bước ra khỏi tòa nhà nhẹ nhõm hơn lúc bước vào.
  - effects: rel.hanh.trust +2, ENDING walked_away

**c3.** Tell Thu you are fine and keep going.  
*VI:* Nói với Thu là anh/chị ổn và tiếp tục.

- (100%) Thu nods and does not push. You feel slightly worse afterwards for having said it.
  - *VI:* Thu gật đầu và không gặng hỏi. Sau đó anh/chị thấy hơi tệ hơn vì đã nói vậy.
  - effects: rel.thu.trust -1, stress +2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.quarter_close_push

*random; tags: close, pressure, dark*

- **Mr Bao:** Quarter end is Friday and I am short by one container. It ships Monday, but the goods are packed and the paperwork is signed. Book it this quarter. Nobody gets hurt.
  - *VI* **Anh Bảo:** Cuối quý là thứ Sáu và em thiếu một container. Thứ Hai mới xuất, nhưng hàng đã đóng gói và giấy tờ đã ký. Anh/chị ghi vào quý này. Không ai bị thiệt.
- **Mr Duc:** Bao has a point. The quarter matters to the bank. See what you can do.
  - *VI* **Anh Đức:** Bảo nói có lý. Quý này quan trọng với ngân hàng. Anh/chị xem làm được gì.

**c1.** Refuse: revenue goes in the period the goods ship, and you tell them why in plain words.  
*VI:* Từ chối: doanh thu vào kỳ hàng được giao đi, và anh/chị giải thích lý do bằng lời đơn giản.

- (80%) It is an uncomfortable meeting. Duc, after a pause, says: 'Fine. Then we explain the quarter to the bank.' Hanh quietly approves.
  - *VI:* Một cuộc họp khó chịu. Sau một lúc im lặng, anh Đức nói: 'Được rồi. Vậy mình giải thích quý này với ngân hàng.' Chị Hạnh lặng lẽ tán thành.
  - effects: rel.bao.trust -6, rel.duc.trust -2, rel.hanh.trust +5, rep.boss +2, stress +3, arc the_cutoff: end
- (20%, goes badly) Duc takes it to the CEO and you are asked to explain to a room full of people. You hold the line; it costs you sleep.
  - *VI:* Anh Đức đưa lên giám đốc và anh/chị phải giải thích trước cả phòng. Anh/chị giữ nguyên lập trường; nó làm anh/chị mất ngủ.
  - effects: rel.bao.trust -8, rel.duc.trust -5, rel.hanh.trust +4, stress +5, arc the_cutoff: end

**c2.** Book it on the shipping date, and sit with Bao to see what could ship legitimately before Friday.  
*VI:* Ghi theo ngày giao hàng, và ngồi với anh Bảo xem có gì xuất hợp lệ được trước thứ Sáu.

- (100%) Bao finds half a container that can ship on Thursday. It is not everything, but it is honest, and he owes you one.
  - *VI:* Anh Bảo tìm được nửa container có thể xuất vào thứ Năm. Không phải tất cả, nhưng trung thực, và anh ấy nợ anh/chị một lần.
  - effects: rel.bao.trust +1, rel.bao.owed +1, rel.hanh.trust +2, stress +1, arc the_cutoff: end

**c3.** Book it this quarter, on the signed paperwork.  
*VI:* Ghi vào quý này, dựa trên giấy tờ đã ký.

- (85%) The quarter closes on target. Duc is relieved and Bao could hug you. You tell yourself it is only three days.
  - *VI:* Quý khép lại đúng chỉ tiêu. Anh Đức nhẹ nhõm và anh Bảo suýt ôm anh/chị. Anh/chị tự nhủ chỉ là ba ngày.
  - effects: rel.bao.trust +7, rel.bao.owed +2, rel.duc.trust +5, stress -2, fact booked_revenue_early (private), arc the_cutoff: followup
- (15%, goes badly) Hanh reviews the quarter-end entries the same afternoon and stops at the container. She asks, very quietly, what is going on.
  - *VI:* Chị Hạnh soát các bút toán cuối quý ngay chiều hôm đó và dừng lại ở container. Chị hỏi, rất khẽ, chuyện gì đang xảy ra.
  - effects: rel.bao.trust +5, rel.hanh.trust -6, stress +3, fact booked_revenue_early (witnessed), arc the_cutoff: followup

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.cutoff_followup

*comes from a storyline; tags: close, pressure, dark, arc*

- **Ms Hanh:** I was going through last quarter. One container is booked three days before the dispatch log says it left. Tell me about it.
  - *VI* **Chị Hạnh:** Chị đang xem lại quý trước. Có một container được ghi ba ngày trước khi nhật ký xuất hàng cho thấy nó rời kho. Em nói cho chị nghe.

**c1.** Tell her straight: Bao asked, Duc leaned on you, you booked it early, and you should not have. Offer to reverse it.  
*VI:* Nói thẳng với chị: anh Bảo nhờ, anh Đức gây áp lực, anh/chị ghi sớm, và lẽ ra không nên. Đề nghị hủy bút toán.

- (100%) Hanh closes her notebook. 'Thank you. We will correct it and I will deal with Bao. Next time, call me before.' You have a reprimand and a reputation for telling the truth.
  - *VI:* Chị Hạnh đóng sổ lại. 'Cảm ơn em. Mình sẽ sửa và chị sẽ làm việc với Bảo. Lần sau gọi chị trước.' Anh/chị nhận một lời nhắc nhở và danh tiếng biết nói thật.
  - effects: rel.hanh.trust +3, rel.bao.trust -6, rel.duc.trust -2, rep.boss -1, stress +3, arc the_cutoff: end

**c2.** Explain the timing and note that the paperwork was signed on the date you booked it.  
*VI:* Giải thích thời điểm và lưu ý rằng giấy tờ đã được ký vào ngày anh/chị ghi.

- (65%) Hanh looks at you for a while. 'The paperwork date is not the cut-off date.' She lets it go, this time, and writes something down.
  - *VI:* Chị Hạnh nhìn anh/chị một lúc. 'Ngày giấy tờ không phải ngày cắt kỳ.' Chị bỏ qua, lần này, và ghi lại điều gì đó.
  - effects: rel.hanh.trust -2, stress +2, arc the_cutoff: test
- (35%, goes badly) Hanh already has the dispatch log printed. She puts it next to your entry and leaves it there.
  - *VI:* Chị Hạnh đã in sẵn nhật ký xuất hàng. Chị đặt nó cạnh bút toán của anh/chị rồi để đó.
  - effects: rel.hanh.trust -6, rep.boss -2, stress +4, arc the_cutoff: test

**c3.** Say Bao told you it had shipped and you trusted him.  
*VI:* Nói anh Bảo bảo hàng đã đi và anh/chị tin anh ấy.

- (50%) Hanh accepts it, slowly. Bao will get a talking-to, and he will know you gave his name.
  - *VI:* Chị Hạnh chấp nhận, chậm rãi. Anh Bảo sẽ bị nhắc nhở, và anh ấy sẽ biết anh/chị đã nhắc tên anh.
  - effects: rel.hanh.trust -1, rel.bao.trust -9, fact deflected_to_sales (private), arc the_cutoff: test
- (50%, goes badly) Bao, called in, says he told you the opposite. Hanh looks at the two of you and draws her own conclusion.
  - *VI:* Anh Bảo được gọi vào, nói rằng anh đã nói điều ngược lại. Chị Hạnh nhìn hai người và tự rút ra kết luận.
  - effects: rel.hanh.trust -7, rel.bao.trust -10, rep.boss -4, stress +4, fact deflected_to_sales (witnessed), arc the_cutoff: test

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.cutoff_test_prep

*comes from a storyline; tags: audit, pressure, dark, arc*

- **Ms Vy:** For the cut-off test I will take the last ten shipments of each quarter and compare invoice dates with dispatch logs. I will send the list next week.
  - *VI* **Chị Vy:** Với kiểm tra cắt kỳ, tôi sẽ lấy mười lô hàng cuối mỗi quý và so ngày hóa đơn với nhật ký xuất hàng. Tuần sau tôi gửi danh sách.
- **Ms Hanh:** If there is anything in those quarters that needs to be corrected, now is when it is cheap.
  - *VI* **Chị Hạnh:** Nếu có gì trong các quý đó cần sửa, bây giờ là lúc chi phí còn rẻ.

**c1.** Correct the entries now, in the open, and tell Vy before she asks.  
*VI:* Sửa các bút toán ngay, công khai, và nói với chị Vy trước khi chị hỏi.

- (100%) Vy writes a finding, but rates it 'corrected voluntarily'. Hanh nods: it is the best outcome available.
  - *VI:* Chị Vy ghi một phát hiện nhưng xếp loại 'tự nguyện sửa'. Chị Hạnh gật đầu: đó là kết quả tốt nhất có thể.
  - effects: rel.vy.trust +5, rel.hanh.trust +4, rep.boss +1, stress +3

**c2.** Prepare a written explanation of the early booking and the reasoning, and hand it over if asked.  
*VI:* Chuẩn bị bản giải trình bằng văn bản về việc ghi sớm và lý do, đưa ra nếu được hỏi.

- (60%) Vy finds the item, reads your explanation, and records it as a cut-off exception with a recommendation.
  - *VI:* Chị Vy tìm thấy khoản đó, đọc giải trình của anh/chị và ghi nhận nó là ngoại lệ cắt kỳ kèm khuyến nghị.
  - effects: rel.vy.trust +1, rep.boss -1, stress +2
- (40%, goes badly) Vy records it as a cut-off error, with your explanation attached. It reads as someone who knew.
  - *VI:* Chị Vy ghi nhận đó là lỗi cắt kỳ, kèm giải trình của anh/chị. Đọc lên thấy giống một người đã biết.
  - effects: rel.vy.trust -3, rel.hanh.trust -3, rep.boss -3, stress +3, fact booked_revenue_early (witnessed)

**c3.** Change the invoice dates in the system to match the dispatch log.  
*VI:* Sửa ngày hóa đơn trong hệ thống cho khớp nhật ký xuất hàng.

- (40%) The dates now agree. You close the window and do not look at the audit trail.
  - *VI:* Các ngày giờ khớp nhau. Anh/chị đóng cửa sổ lại và không nhìn vào lịch sử thay đổi.
  - effects: stress -1, fact backdated_invoice_entry (private)
- (60%, goes badly) The system logged every change with a time and a user name. Vy's analyst finds them within an hour.
  - *VI:* Hệ thống ghi lại mọi thay đổi kèm thời gian và tên người dùng. Chuyên viên của chị Vy tìm thấy trong vòng một giờ.
  - effects: rel.vy.trust -12, rel.hanh.trust -10, rep.boss -8, stress +6, fact backdated_invoice_entry (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.long_receipts

*random; tags: expenses, pressure, dark*

- **Mr Long:** Here is last month's pile of expenses. No receipts, I am afraid, I lose them. But you know it is all for the business. Please just process it.
  - *VI* **Anh Long:** Đây là chồng chi phí tháng trước. Không có hóa đơn, em xin lỗi, em hay làm mất. Nhưng anh/chị biết tất cả đều cho công ty. Anh/chị cứ xử lý giúp.

**c1.** Explain that nothing is processed without a receipt, and offer to help him get duplicates from the vendors.  
*VI:* Giải thích rằng không có hóa đơn thì không xử lý, và đề nghị giúp anh ấy xin bản sao từ nhà cung cấp.

- (75%) Long is irritated, but two days later he returns with half the receipts. Hanh nods when she hears about it.
  - *VI:* Anh Long bực mình, nhưng hai ngày sau anh quay lại với một nửa số hóa đơn. Chị Hạnh gật đầu khi nghe chuyện.
  - effects: rel.long.trust -3, rel.hanh.trust +4, stress +1, arc the_receipt_problem: end
- (25%, goes badly) Long complains to his uncle that Finance is being difficult. The uncle says nothing to you, but your name gets mentioned.
  - *VI:* Anh Long phàn nàn với chú rằng bên Tài chính làm khó. Ông chú không nói gì với anh/chị, nhưng tên anh/chị được nhắc tới.
  - effects: rel.long.trust -8, rel.duc.trust -3, rel.hanh.trust +4, stress +3, arc the_receipt_problem: end

**c2.** Book the smallest items as a staff advance to be settled against receipts within thirty days.  
*VI:* Ghi các khoản nhỏ thành tạm ứng nhân viên, thanh toán theo hóa đơn trong ba mươi ngày.

- (100%) It is a workable compromise and Long accepts it, for now. The advance sits on your list, and so does he.
  - *VI:* Một thỏa hiệp khả thi và anh Long chấp nhận, tạm thời. Khoản tạm ứng nằm trong danh sách của anh/chị, anh ấy cũng vậy.
  - effects: rel.long.trust +1, rel.hanh.trust +1, arc the_receipt_problem: personal

**c3.** Process it as business expenses, since he says it is for the business.  
*VI:* Xử lý như chi phí kinh doanh vì anh ấy nói là cho công ty.

- (85%) It goes through and Long is pleasantly surprised. 'You are a practical person.' He remembers.
  - *VI:* Mọi thứ thông qua và anh Long vui bất ngờ. 'Anh/chị là người thực tế.' Anh ấy nhớ điều đó.
  - effects: rel.long.trust +6, rel.long.owed +1, stress -1, fact accepted_missing_receipt (private), arc the_receipt_problem: personal
- (15%, goes badly) Thu, doing the payment run, asks why thirty-four entries have no attachments. You find an answer that is shorter than the truth.
  - *VI:* Thu, khi làm đợt chi, hỏi vì sao ba mươi bốn bút toán không có chứng từ đính kèm. Anh/chị đưa ra một câu trả lời ngắn hơn sự thật.
  - effects: rel.long.trust +4, rel.thu.trust -5, fact accepted_missing_receipt (witnessed), arc the_receipt_problem: personal

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.long_personal

*comes from a storyline; tags: expenses, dark, arc*

- **Mr Long:** I have one more. It is a dinner for ten at a nice place. Put it under client entertainment. It was a family dinner, but really, our clients are family, in a way.
  - *VI* **Anh Long:** Còn một khoản nữa. Bữa tối mười người ở một nơi sang trọng. Anh/chị ghi vào tiếp khách. Thực ra là bữa ăn gia đình, nhưng thật ra khách hàng của mình cũng như người nhà.

**c1.** Refuse to book it as business, and suggest he reimburses it personally.  
*VI:* Từ chối ghi là chi phí kinh doanh và gợi ý anh ấy tự thanh toán.

- (100%) He stares at you for a moment, then laughs, not kindly. 'You have spine. I will remember that.' The receipt goes into the personal pile.
  - *VI:* Anh ấy nhìn anh/chị một lúc rồi cười, không thiện cảm. 'Anh/chị có bản lĩnh. Tôi sẽ nhớ.' Hóa đơn chuyển sang chồng cá nhân.
  - effects: rel.long.trust -8, rel.hanh.trust +3, stress +2, arc the_receipt_problem: end

**c2.** Take it to Hanh and let her decide.  
*VI:* Mang lên chị Hạnh để chị quyết định.

- (100%) Hanh says no, and handles Long herself, with a very short call. You are out of the middle, and Long knows who sent it up.
  - *VI:* Chị Hạnh nói không và tự xử lý anh Long bằng một cuộc gọi rất ngắn. Anh/chị thoát khỏi vị trí kẹt giữa, và anh Long biết ai đã báo lên.
  - effects: rel.hanh.trust +4, rel.long.trust -6, stress +1, arc the_receipt_problem: end

**c3.** Book it as client entertainment.  
*VI:* Ghi là chi phí tiếp khách.

- (80%) Done. Long thanks you warmly. The entry is labelled 'client event'. It is not quite a lie, and it is not quite true.
  - *VI:* Xong. Anh Long cảm ơn nồng nhiệt. Bút toán được gắn nhãn 'sự kiện khách hàng'. Không hẳn là nói dối, và cũng không hẳn là đúng.
  - effects: rel.long.trust +8, rel.long.owed +2, stress +1, fact booked_personal_expense (private), arc the_receipt_problem: event
- (20%, goes badly) Thu sees a restaurant name she recognises, from a family photo in Long's office. She says nothing, but she looks.
  - *VI:* Thu thấy tên một nhà hàng mà em nhận ra, từ tấm ảnh gia đình trong phòng anh Long. Em không nói gì, nhưng em nhìn.
  - effects: rel.long.trust +6, rel.thu.trust -6, fact booked_personal_expense (witnessed), arc the_receipt_problem: event

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.long_event

*comes from a storyline; tags: expenses, dark, arc*

- **Mr Long:** My cousin's engagement party. Thirty-eight million dong. Book it to marketing. Duc has already said it is fine, more or less.
  - *VI* **Anh Long:** Tiệc đính hôn của em họ tôi. Ba mươi tám triệu đồng. Anh/chị ghi vào marketing. Anh Đức đã nói được rồi, đại khái vậy.

**c1.** Take the invoice to Hanh and Duc together and ask for a written decision.  
*VI:* Mang hóa đơn đến chị Hạnh và anh Đức cùng lúc và xin quyết định bằng văn bản.

- (85%) Duc's 'more or less' turns out to have been 'not at all'. Nobody wants to put it in writing. It is reclassified as personal.
  - *VI:* 'Đại khái' của anh Đức hóa ra là 'hoàn toàn không'. Không ai muốn ghi ra giấy. Khoản này được chuyển thành cá nhân.
  - effects: rel.long.trust -10, rel.hanh.trust +5, rel.duc.trust -2, rep.boss +3, stress +4, arc the_receipt_problem: end
- (15%, goes badly) Duc says, in front of Hanh, that it is the owner's family and to keep it simple. Hanh's face does not change. Your hands shake a little.
  - *VI:* Anh Đức nói, trước mặt chị Hạnh, rằng đó là gia đình chủ và nên làm cho đơn giản. Gương mặt chị Hạnh không đổi. Tay anh/chị run nhẹ.
  - effects: rel.long.trust -4, rel.hanh.trust +3, rel.duc.trust +2, stress +5, arc the_receipt_problem: end

**c2.** Refuse and say you will not book it without a business purpose, and leave it there.  
*VI:* Từ chối và nói anh/chị không ghi nếu không có mục đích kinh doanh, rồi để đó.

- (100%) Long goes red, then white. He does not raise his voice. He says he will speak to someone else. Nothing is booked.
  - *VI:* Anh Long đỏ mặt rồi tái đi. Anh không to tiếng. Anh nói sẽ nói chuyện với người khác. Không có gì được ghi.
  - effects: rel.long.trust -12, rel.hanh.trust +2, stress +3, arc the_receipt_problem: end

**c3.** Book it to marketing.  
*VI:* Ghi vào marketing.

- (85%) Thirty-eight million leaves the marketing budget without a word of resistance. Long says, 'I will not forget this.' He does not say what he means by it.
  - *VI:* Ba mươi tám triệu rời ngân sách marketing mà không một lời phản đối. Anh Long nói: 'Tôi sẽ không quên.' Anh không nói rõ ý.
  - effects: rel.long.trust +10, rel.long.owed +3, rel.hanh.trust -2, stress +2, fact booked_personal_expense (private), arc the_receipt_problem: support
- (15%, goes badly) The marketing manager sees the charge and asks what campaign it was. Nobody has an answer, and word gets around fast.
  - *VI:* Quản lý marketing thấy khoản chi và hỏi đó là chiến dịch nào. Không ai có câu trả lời, và tin đồn lan nhanh.
  - effects: rel.long.trust +8, rel.hanh.trust -5, rep.boss -4, fact booked_personal_expense (rumor), arc the_receipt_problem: support

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.receipt_support

*comes from a storyline; tags: expenses, dark, arc*

- **Mr Long:** The auditor will want paperwork for the party. Can you get a letter from a supplier, saying it was a marketing event? Someone who owes us. Just a letter.
  - *VI* **Anh Long:** Kiểm toán sẽ đòi giấy tờ cho bữa tiệc. Anh/chị xin một lá thư từ một nhà cung cấp, nói đó là sự kiện marketing được không? Người nào đó nợ mình. Chỉ một lá thư.

**c1.** Refuse, and tell him the only safe route now is to reclassify the expense as personal.  
*VI:* Từ chối và nói với anh ấy rằng con đường an toàn duy nhất bây giờ là chuyển khoản này thành cá nhân.

- (100%) Long is silent, then says, 'You are making this difficult.' You are not, but you feel the cost of saying so.
  - *VI:* Anh Long im lặng rồi nói: 'Anh/chị đang làm khó tôi.' Anh/chị không làm khó, nhưng anh/chị cảm thấy cái giá của việc nói điều đó.
  - effects: rel.long.trust -6, rel.hanh.trust +3, rep.boss +1, stress +3, arc the_receipt_problem: end

**c2.** Ask him for the real documents: a vendor quote, a booking, anything honest.  
*VI:* Xin anh ấy các giấy tờ thật: báo giá, đặt chỗ, bất cứ thứ gì trung thực.

- (50%) He finds an actual booking confirmation. It does not make the party a business event, but it is true and you file it.
  - *VI:* Anh ấy tìm được một xác nhận đặt chỗ thật. Nó không biến bữa tiệc thành sự kiện kinh doanh, nhưng là sự thật và anh/chị lưu lại.
  - effects: rel.long.trust +1, stress +1, arc the_receipt_problem: end
- (50%, goes badly) He comes back empty-handed and annoyed. The question of what to book remains open.
  - *VI:* Anh ấy quay lại tay trắng và bực bội. Câu hỏi nên ghi gì vẫn còn đó.
  - effects: rel.long.trust -4, stress +2, arc the_receipt_problem: end

**c3.** Draft the letter yourself for a supplier to sign.  
*VI:* Tự soạn lá thư để một nhà cung cấp ký.

- (55%) The supplier signs without reading. Long pats your arm. You file a document that says something that did not happen.
  - *VI:* Nhà cung cấp ký mà không đọc. Anh Long vỗ vai anh/chị. Anh/chị lưu một tài liệu nói về điều chưa từng xảy ra.
  - effects: rel.long.trust +8, rel.long.owed +3, stress +4, fact created_support_document (private), arc the_receipt_problem: end
- (45%, goes badly) The supplier's accountant reads it and calls Hanh to check. You can hear her voice through the glass.
  - *VI:* Kế toán của nhà cung cấp đọc nó và gọi chị Hạnh để kiểm tra. Anh/chị nghe thấy giọng chị qua lớp kính.
  - effects: rel.long.trust +2, rel.hanh.trust -12, rep.boss -8, stress +6, fact created_support_document (public), arc the_receipt_problem: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.vy_asks_receipts

*random; tags: audit, dark, consequence*

- **Ms Vy:** I have a list of expenses where the business purpose is thin. Two of them have no receipt, and one is for a restaurant that I think I have seen in a wedding photograph. Can we go through them?
  - *VI* **Chị Vy:** Tôi có danh sách các khoản chi có mục đích kinh doanh mỏng. Hai khoản không có hóa đơn và một khoản ở nhà hàng mà tôi nghĩ tôi từng thấy trong ảnh cưới. Mình xem qua chúng nhé?

**c1.** Show her exactly what you have, say which entries you think were wrong, and name who asked for them.  
*VI:* Cho chị ấy xem chính xác những gì anh/chị có, nói các bút toán nào anh/chị cho là sai và nêu ai đã yêu cầu.

- (100%) It is the hardest conversation of your year. Vy writes it down and asks that the expenses be reclassified. Hanh, told afterwards, says: 'You should have come to me first. But thank you.'
  - *VI:* Đây là cuộc trò chuyện khó nhất trong năm của anh/chị. Chị Vy ghi lại và đề nghị phân loại lại các khoản chi. Chị Hạnh, được báo sau đó, nói: 'Lẽ ra em phải đến gặp chị trước. Nhưng cảm ơn em.'
  - effects: rel.vy.trust +3, rel.hanh.trust +1, rel.long.trust -10, rep.boss -2, stress +5, fact came_clean_to_auditor (witnessed)

**c2.** Explain the circumstances and say you followed instructions, without naming anyone.  
*VI:* Giải thích hoàn cảnh và nói anh/chị làm theo chỉ dẫn, không nêu tên ai.

- (60%) Vy nods slowly: 'Instructions from whom?' She writes down your non-answer.
  - *VI:* Chị Vy gật đầu chậm: 'Chỉ dẫn từ ai?' Chị ghi lại việc anh/chị không trả lời.
  - effects: rel.vy.trust -4, rel.hanh.trust -2, stress +3
- (40%, goes badly) Vy's analyst has the approval log. The name comes up anyway, and it is next to your user id.
  - *VI:* Chuyên viên của chị Vy có nhật ký phê duyệt. Cái tên vẫn hiện ra, ngay cạnh mã người dùng của anh/chị.
  - effects: rel.vy.trust -7, rel.hanh.trust -6, rep.boss -5, stress +5

**c3.** Produce the supplier letter and the booking confirmation as support.  
*VI:* Đưa thư của nhà cung cấp và xác nhận đặt chỗ làm chứng từ.

- (35%) Vy reads the letter. She does not challenge it. She files it, and you leave the room sweating.
  - *VI:* Chị Vy đọc lá thư. Chị không chất vấn. Chị lưu lại, và anh/chị rời phòng trong mồ hôi.
  - effects: stress +4, rel.vy.trust -3
- (65%, goes badly) Vy holds the letter up to the light, then puts it next to the supplier's own stationery from last year. The fonts do not match.
  - *VI:* Chị Vy giơ lá thư lên ánh sáng, rồi đặt cạnh giấy tiêu đề của chính nhà cung cấp hồi năm ngoái. Phông chữ không khớp.
  - effects: rel.vy.trust -15, rel.hanh.trust -10, rep.boss -10, stress +8, fact created_support_document (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.profit_smoothing

*random; tags: accruals, dark, pressure*

- **Mr Duc:** This month is unusually strong. It would be a pity to show a spike and then a dip. Why not put a healthy provision against future warranty claims? It will smooth the year.
  - *VI* **Anh Đức:** Tháng này mạnh bất thường. Sẽ tiếc nếu đồ thị lên cao rồi tụt xuống. Sao mình không trích một khoản dự phòng dồi dào cho bảo hành tương lai? Nó sẽ làm cả năm đều hơn.

**c1.** Decline: you will provide what the claims history supports, and show him the numbers.  
*VI:* Từ chối: anh/chị sẽ trích theo những gì lịch sử bảo hành hỗ trợ và cho anh ấy xem số liệu.

- (100%) Duc grumbles that accountants are not supposed to be this literal. But the provision you book is defensible, and he cannot find fault with the working.
  - *VI:* Anh Đức càu nhàu rằng kế toán không nên quá nguyên tắc như thế. Nhưng khoản dự phòng anh/chị ghi bảo vệ được và anh ấy không bắt lỗi được bảng tính.
  - effects: rel.duc.trust -3, rel.hanh.trust +4, rep.boss +1, stress +2, arc the_cookie_jar: end

**c2.** Book a modest, evidence-based increase and note it as prudence.  
*VI:* Ghi một khoản tăng vừa phải dựa trên bằng chứng và ghi chú là thận trọng.

- (100%) It is not what Duc wanted but it is something. Hanh says nothing, which from her is a yes.
  - *VI:* Không phải điều anh Đức muốn nhưng có còn hơn không. Chị Hạnh không nói gì, mà từ chị thì đó là đồng ý.
  - effects: rel.duc.trust +1, rel.hanh.trust +2, stress +1, arc the_cookie_jar: end

**c3.** Book the generous provision he is asking for.  
*VI:* Ghi khoản dự phòng dồi dào như anh ấy yêu cầu.

- (85%) The month's profit drops to a comfortable level. The extra sits in a balance sheet account called 'warranty provision'.
  - *VI:* Lợi nhuận tháng giảm về mức dễ chịu. Khoản dư nằm trong một tài khoản bảng cân đối mang tên 'dự phòng bảo hành'.
  - effects: rel.duc.trust +5, stress -1, fact padded_reserve (private), arc the_cookie_jar: release
- (15%, goes badly) Hanh asks what claims history justifies the provision. You show her last year's claims. They do not add up to half of it.
  - *VI:* Chị Hạnh hỏi lịch sử bảo hành nào biện minh cho khoản dự phòng. Anh/chị cho chị xem các yêu cầu năm ngoái. Chúng không bằng một nửa.
  - effects: rel.duc.trust +3, rel.hanh.trust -6, stress +3, fact padded_reserve (witnessed), arc the_cookie_jar: release

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.reserve_release

*comes from a storyline; tags: accruals, dark, pressure, arc*

- **Mr Duc:** The quarter is weak, and the bank wants to see that we have hit our profit target. We have a healthy provision sitting unused. It would be natural to release some of it, would it not?
  - *VI* **Anh Đức:** Quý này yếu, và ngân hàng muốn thấy mình đạt chỉ tiêu lợi nhuận. Mình có một khoản dự phòng dồi dào đang để không. Giải phóng một phần là tự nhiên, đúng không?

**c1.** Refuse to release it without a change in the underlying claims risk, and say why.  
*VI:* Từ chối giải phóng khi rủi ro bảo hành không thay đổi và nói rõ lý do.

- (100%) Duc is cold but does not argue. The profit target is missed, honestly. Hanh looks at you, then at the window.
  - *VI:* Anh Đức lạnh lùng nhưng không tranh cãi. Chỉ tiêu lợi nhuận không đạt, một cách trung thực. Chị Hạnh nhìn anh/chị rồi nhìn ra cửa sổ.
  - effects: rel.duc.trust -6, rel.hanh.trust +5, rep.boss -1, stress +4, arc the_cookie_jar: end

**c2.** Release only the part that the claims data no longer supports, and document why.  
*VI:* Chỉ giải phóng phần mà dữ liệu bảo hành không còn hỗ trợ và ghi rõ lý do.

- (100%) It is a fair adjustment, with working papers. Duc accepts it as better than nothing. Hanh reviews it and signs.
  - *VI:* Một điều chỉnh công bằng, có bảng tính. Anh Đức chấp nhận vì còn hơn không. Chị Hạnh soát và ký.
  - effects: rel.duc.trust +1, rel.hanh.trust +2, stress +2, arc the_cookie_jar: end

**c3.** Release whatever is needed to hit the target.  
*VI:* Giải phóng bao nhiêu cũng được để đạt chỉ tiêu.

- (75%) The target is hit, to the dong. Duc shakes your hand. The bank's analyst sends a congratulatory email.
  - *VI:* Đạt chỉ tiêu, chính xác đến từng đồng. Anh Đức bắt tay anh/chị. Chuyên viên ngân hàng gửi email chúc mừng.
  - effects: rel.duc.trust +7, rel.hanh.trust -3, stress -2, fact released_reserve_to_hit_target (private), arc the_cookie_jar: end
- (25%, goes badly) The auditor notices the pattern: a provision built in a good month and released in a bad one. She asks for the claims data.
  - *VI:* Kiểm toán viên nhận ra quy luật: dự phòng được lập trong tháng tốt và giải phóng trong tháng xấu. Chị yêu cầu dữ liệu bảo hành.
  - effects: rel.duc.trust +4, rel.hanh.trust -8, rel.vy.trust -8, rep.boss -6, stress +5, fact released_reserve_to_hit_target (public), arc the_cookie_jar: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.thu_training

*random; tags: people, onboarding*

- **Thu:** I am not sure I understand the approval limits for vendor payments. Nobody ever showed me. I do not want to post something I should not.
  - *VI* **Thu:** Em không chắc mình hiểu hạn mức phê duyệt cho thanh toán nhà cung cấp. Chưa ai chỉ cho em. Em không muốn ghi nhận thứ không nên ghi.

**c1.** Sit with her for an hour and walk through the rules, with examples.  
*VI:* Ngồi với em một giờ và giải thích các quy định kèm ví dụ.

- (100%) Thu takes notes in her little book and thanks you twice. The next week she catches an error that would have slipped past you.
  - *VI:* Thu ghi chú vào cuốn sổ nhỏ và cảm ơn anh/chị hai lần. Tuần sau em bắt được một lỗi lẽ ra đã lọt qua anh/chị.
  - effects: rel.thu.trust +6, rel.thu.loyalty +4, rel.hanh.trust +1, stress +1, arc thu: mistake

**c2.** Give her the policy and offer to check her first ten payments.  
*VI:* Đưa em chính sách và nhận kiểm tra mười khoản thanh toán đầu tiên.

- (100%) It works well enough. Thu is careful, and careful takes a while.
  - *VI:* Cũng khá ổn. Thu cẩn thận, và cẩn thận thì mất thời gian.
  - effects: rel.thu.trust +3, arc thu: mistake

**c3.** Tell her to do it like last year's files and ask if she gets stuck.  
*VI:* Bảo em làm theo hồ sơ năm ngoái và hỏi nếu bị kẹt.

- (100%) Thu nods, a little too quickly. You can see she will not ask.
  - *VI:* Thu gật đầu, hơi quá nhanh. Anh/chị thấy em sẽ không hỏi.
  - effects: rel.thu.trust -2, arc thu: mistake

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.thu_mistake

*comes from a storyline; tags: people, dark, arc*

- **Thu:** I posted a vendor payment twice. One point two million. I found out this morning. Please, I do not know what to do. If Hanh finds out... I have a small child.
  - *VI* **Thu:** Em ghi nhận một khoản thanh toán nhà cung cấp hai lần. Một triệu hai. Sáng nay em mới phát hiện. Anh/chị ơi, em không biết làm sao. Nếu chị Hạnh biết... em có một đứa con nhỏ.

**c1.** Reverse it properly, log it, and go through how it happened together so it does not repeat.  
*VI:* Hủy đúng quy trình, ghi nhận và cùng xem nó xảy ra thế nào để không lặp lại.

- (85%) You fix it in an hour. Thu cries a little with relief. 'I will never do it again.' You tell Hanh yourself, calmly, as a process gap. She nods.
  - *VI:* Anh/chị sửa trong một giờ. Thu khóc nhẹ vì nhẹ nhõm. 'Em sẽ không bao giờ làm lại.' Anh/chị tự nói với chị Hạnh, bình tĩnh, như một lỗ hổng quy trình. Chị gật đầu.
  - effects: rel.thu.trust +7, rel.thu.loyalty +5, rel.hanh.trust +3, stress +2, arc thu: audit
- (15%, goes badly) Hanh is unhappy about the mistake, and more unhappy to have heard it from you second. But the record is clean.
  - *VI:* Chị Hạnh không vui về sai sót, và không vui hơn vì nghe chuyện từ anh/chị đến thứ hai. Nhưng hồ sơ sạch.
  - effects: rel.thu.trust +5, rel.hanh.trust -1, stress +3, arc thu: audit

**c2.** Reverse it and log it, but keep Thu's name out of the note.  
*VI:* Hủy và ghi nhận, nhưng không ghi tên Thu trong ghi chú.

- (100%) The note says 'duplicate posting, corrected'. It is true. It is also a little short. Thu holds your eye for a moment and looks away.
  - *VI:* Ghi chú nói 'ghi trùng, đã sửa'. Đúng sự thật. Nhưng cũng hơi ngắn. Thu nhìn thẳng vào mắt anh/chị một lúc rồi quay đi.
  - effects: rel.thu.trust +4, rel.thu.loyalty +2, arc thu: audit

**c3.** Quietly reverse it and do not log it at all.  
*VI:* Lặng lẽ hủy và không ghi nhận gì cả.

- (70%) It is gone and nobody knows. Thu would walk through fire for you. She keeps a note of it in her book.
  - *VI:* Khoản đó biến mất và không ai biết. Thu sẽ vào lửa cho anh/chị. Em ghi nó vào cuốn sổ.
  - effects: rel.thu.trust +9, rel.thu.loyalty +8, rel.thu.owed +2, stress +2, fact covered_up_error (private), arc thu: audit
- (30%, goes badly) The vendor's statement shows the duplicate payment and the reversal with no journal note. Hanh sees it.
  - *VI:* Sao kê của nhà cung cấp cho thấy thanh toán trùng và khoản hủy mà không có ghi chú bút toán. Chị Hạnh thấy.
  - effects: rel.thu.trust +5, rel.hanh.trust -6, rep.boss -3, stress +4, fact covered_up_error (witnessed), arc thu: audit

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.thu_at_audit

*comes from a storyline; tags: audit, people, dark, arc*

- **Ms Vy:** I see a duplicate payment reversed in the spring. I would like to hear, from the person who posted it, how it happened and who reviewed the correction.
  - *VI* **Chị Vy:** Tôi thấy một khoản thanh toán trùng được hủy hồi mùa xuân. Tôi muốn nghe từ chính người đã ghi nhận nó về việc nó xảy ra thế nào và ai đã soát lại bút toán sửa.
- **Thu:** Um. I... it was me. I am not sure what to say.
  - *VI* **Thu:** Dạ. Em... là em. Em không biết nói gì.

**c1.** Tell Thu to say exactly what happened, and sit beside her while she does.  
*VI:* Bảo Thu nói đúng sự việc và ngồi cạnh em khi em nói.

- (100%) Thu tells it plainly and Vy listens. The finding is recorded as a process improvement. Afterwards Thu says, quietly, 'Thank you for being there.'
  - *VI:* Thu kể rõ ràng và chị Vy lắng nghe. Phát hiện được ghi nhận là cải tiến quy trình. Sau đó Thu khẽ nói: 'Cảm ơn anh/chị đã ở đó.'
  - effects: rel.thu.trust +6, rel.vy.trust +3, rel.hanh.trust +2, stress +1

**c2.** Let Thu answer on her own, she made the entry.  
*VI:* Để Thu tự trả lời, em là người ghi bút toán.

- (100%) Thu struggles through it. Vy is patient, but it is obvious nobody prepared her. She avoids your eyes for a week.
  - *VI:* Thu vật lộn trả lời. Chị Vy kiên nhẫn, nhưng rõ ràng không ai chuẩn bị cho em. Em tránh ánh mắt anh/chị cả tuần.
  - effects: rel.thu.trust -6, rel.thu.loyalty -4, stress +2

**c3.** Tell Thu what to say, and what not to mention.  
*VI:* Bảo Thu nên nói gì và không nên nhắc gì.

- (50%) Thu recites the script. Vy makes a note that the answers sound rehearsed, and moves on.
  - *VI:* Thu đọc kịch bản. Chị Vy ghi chú rằng câu trả lời nghe như được tập trước, rồi chuyển tiếp.
  - effects: rel.thu.trust -3, rel.vy.trust -4, stress +3, fact scripted_witness (private)
- (50%, goes badly) Thu's voice cracks in the middle of the script. She looks at you, then at Vy, then says what actually happened. The room goes very quiet.
  - *VI:* Giọng Thu nghẹn giữa chừng kịch bản. Em nhìn anh/chị, nhìn chị Vy, rồi nói điều thực sự đã xảy ra. Căn phòng rất yên lặng.
  - effects: rel.thu.trust -5, rel.vy.trust -10, rel.hanh.trust -6, rep.boss -5, stress +6, fact scripted_witness (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.first_adjustment

*random; tags: onboarding, pressure*

- **Ms Hanh:** This small adjusting entry needs a reason on file before it can post. Duc wants it in today. The reason is not obvious to me either, to be honest.
  - *VI* **Chị Hạnh:** Bút toán điều chỉnh nhỏ này cần có lý do trong hồ sơ mới ghi được. Anh Đức muốn ghi ngay hôm nay. Nói thật, chị cũng chưa thấy lý do rõ ràng.

**c1.** Ask Duc for the reason in writing before posting it.  
*VI:* Xin anh Đức lý do bằng văn bản trước khi ghi.

- (80%) Duc sends two lines. They are reasonable. Hanh posts it and gives you a nod, the first one.
  - *VI:* Anh Đức gửi hai dòng. Hợp lý. Chị Hạnh ghi và gật đầu với anh/chị, lần đầu tiên.
  - effects: rel.hanh.trust +3, rel.duc.trust -1, stress +1
- (20%, goes badly) Duc replies, 'Just post it.' Hanh looks at the reply for a long time, then decides not to post it today.
  - *VI:* Anh Đức trả lời: 'Cứ ghi đi.' Chị Hạnh nhìn tin nhắn rất lâu rồi quyết định hôm nay không ghi.
  - effects: rel.hanh.trust +4, rel.duc.trust -4, stress +2

**c2.** Write the reason you think is most likely and post it.  
*VI:* Viết lý do anh/chị cho là có khả năng nhất và ghi.

- (100%) It posts. The reason on file is a guess, dressed as a fact. Hanh does not check it.
  - *VI:* Bút toán được ghi. Lý do trong hồ sơ là một phỏng đoán khoác áo sự thật. Chị Hạnh không kiểm tra.
  - effects: rel.duc.trust +2, fact guessed_adjustment_reason (private)

**c3.** Post it with the reason left blank and deal with it later.  
*VI:* Ghi với lý do để trống và xử lý sau.

- (100%) It posts, with an empty box. The empty box will be noticed by someone, one day.
  - *VI:* Bút toán được ghi, với một ô trống. Ô trống đó sẽ có ngày bị ai đó chú ý.
  - effects: rel.duc.trust +1, rel.hanh.trust -2, stress -1

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.missing_documents

*random; tags: documents, pressure*

- **Thu:** These invoices from sales do not have delivery proof attached. Bao says it is fine, the goods definitely went. Do we pay on them or chase?
  - *VI* **Thu:** Các hóa đơn này từ bên kinh doanh không có chứng từ giao hàng đính kèm. Anh Bảo nói ổn, hàng chắc chắn đã đi. Mình xử lý luôn hay đi đòi chứng từ?

**c1.** Hold the invoices until the delivery proof arrives, and help Thu chase it.  
*VI:* Giữ các hóa đơn cho đến khi có chứng từ giao hàng và cùng Thu đi đòi.

- (85%) Two days later the proof arrives for all but one. The one is genuinely missing, and finding out why is worth the trouble.
  - *VI:* Hai ngày sau chứng từ về đủ trừ một bộ. Bộ đó thực sự thiếu, và tìm ra lý do xứng đáng với công sức.
  - effects: rel.thu.trust +3, rel.bao.trust -3, rel.hanh.trust +2, stress +1
- (15%, goes badly) Bao says you are slowing down his customers. The proof arrives eventually, and the invoices were fine.
  - *VI:* Anh Bảo nói anh/chị đang làm chậm khách hàng của anh. Chứng từ rốt cuộc cũng về và các hóa đơn đều ổn.
  - effects: rel.bao.trust -5, stress +2

**c2.** Process them with a note that proof is outstanding, and set a two-day deadline.  
*VI:* Xử lý kèm ghi chú chứng từ còn thiếu và đặt hạn hai ngày.

- (100%) Everyone gets most of what they want. The deadline is met on the third day, which you count as a win.
  - *VI:* Mọi người đều có phần lớn điều họ muốn. Hạn được đáp ứng vào ngày thứ ba, và anh/chị tính đó là một thắng lợi.
  - effects: rel.thu.trust +1, rel.hanh.trust +1

**c3.** Process them on Bao's word.  
*VI:* Xử lý theo lời anh Bảo.

- (85%) Bao is happy. The invoices are paid. The delivery proof never turns up, and nobody mentions it again.
  - *VI:* Anh Bảo vui. Các hóa đơn được thanh toán. Chứng từ giao hàng không bao giờ xuất hiện, và không ai nhắc lại.
  - effects: rel.bao.trust +4, stress -1, fact accepted_missing_receipt (private)
- (15%, goes badly) One shipment never left the warehouse. The customer was invoiced for goods that did not arrive.
  - *VI:* Một lô hàng chưa bao giờ rời kho. Khách bị xuất hóa đơn cho hàng chưa đến.
  - effects: rel.bao.trust +2, rel.hanh.trust -5, rep.buyer -4, rep.boss -3, fact accepted_missing_receipt (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.duplicate_payment

*random; tags: payments, integrity*

- **Thu:** A supplier refunded us 3.4 million dong by mistake, a duplicate from two months ago. It went to our bank account on Friday. They have not noticed. What do we do?
  - *VI* **Thu:** Một nhà cung cấp hoàn nhầm cho mình 3,4 triệu đồng, khoản thanh toán trùng từ hai tháng trước. Tiền đã vào tài khoản hôm thứ Sáu. Họ chưa nhận ra. Mình làm sao đây?

**c1.** Tell the supplier and return it, with a note in the ledger.  
*VI:* Báo nhà cung cấp và hoàn lại, kèm ghi chú trong sổ.

- (100%) The supplier is stunned and grateful. Thu watches how you handle it and writes something in her notebook. It is something good.
  - *VI:* Nhà cung cấp sững sờ và biết ơn. Thu quan sát cách anh/chị xử lý và ghi gì đó vào sổ. Đó là điều tốt.
  - effects: rel.thu.trust +4, rel.hanh.trust +2, rep.finance +2

**c2.** Hold it in a separate account and raise it with Hanh before deciding.  
*VI:* Giữ trong một tài khoản riêng và nêu với chị Hạnh trước khi quyết định.

- (100%) Hanh says to return it, and thanks you for asking before acting. It costs a day.
  - *VI:* Chị Hạnh bảo hoàn lại và cảm ơn anh/chị đã hỏi trước khi làm. Mất một ngày.
  - effects: rel.hanh.trust +3, rel.thu.trust +1

**c3.** Keep it quietly. They did not notice.  
*VI:* Lặng lẽ giữ lại. Họ không nhận ra.

- (80%) The money lands in other income. Nobody asks. Thu looks at you, and then at her notebook.
  - *VI:* Tiền vào thu nhập khác. Không ai hỏi. Thu nhìn anh/chị rồi nhìn cuốn sổ.
  - effects: rel.thu.trust -5, stress +1, fact kept_duplicate_payment (private)
- (20%, goes badly) The supplier's accountant notices two weeks later and sends a polite, exact email copied to Hanh.
  - *VI:* Kế toán nhà cung cấp phát hiện hai tuần sau và gửi một email lịch sự, chính xác, đồng gửi chị Hạnh.
  - effects: rel.thu.trust -6, rel.hanh.trust -6, rep.boss -3, fact kept_duplicate_payment (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.fx_difference

*random; tags: payments, judgement*

- **Ms Hanh:** The dong moved against the dollar this week. We have a receipt due that would show a nice exchange gain if booked on Monday, and a smaller one if booked today. Policy says the date the money arrives. It arrives Monday.
  - *VI* **Chị Hạnh:** Tuần này tiền đồng biến động so với đô la. Có một khoản thu sẽ cho lãi tỷ giá đẹp nếu ghi vào thứ Hai, và nhỏ hơn nếu ghi hôm nay. Chính sách nói ngày tiền về. Tiền về vào thứ Hai.

**c1.** Book it on the date the money arrives, as the policy says.  
*VI:* Ghi vào ngày tiền về, đúng chính sách.

- (100%) Hanh nods. The gain is what it is, and the policy worked as intended.
  - *VI:* Chị Hạnh gật đầu. Khoản lãi là như vậy, và chính sách hoạt động đúng như dự kiến.
  - effects: rel.hanh.trust +2

**c2.** Ask Duc whether the policy allows a choice, and follow his written answer.  
*VI:* Hỏi anh Đức chính sách có cho phép lựa chọn không và làm theo câu trả lời bằng văn bản.

- (100%) Duc confirms: the arrival date. The gain is booked properly, and he half-jokes that he hoped you would say otherwise.
  - *VI:* Anh Đức xác nhận: ngày tiền về. Khoản lãi được ghi đúng, và anh nửa đùa rằng anh mong anh/chị nói khác.
  - effects: rel.duc.trust +1, rel.hanh.trust +1

**c3.** Book it on whichever date gives the better number.  
*VI:* Ghi vào ngày nào cho con số đẹp hơn.

- (80%) The gain is 1.1 million better than it would have been. It is a small thing, and it is exactly how a habit starts.
  - *VI:* Khoản lãi nhiều hơn 1,1 triệu. Chuyện nhỏ, và đó chính xác là cách một thói quen bắt đầu.
  - effects: rel.duc.trust +2, fact timed_fx_gain (private)
- (20%, goes badly) Hanh checks the bank advice against the booking date and finds the mismatch. She says nothing, which is worse than a lecture.
  - *VI:* Chị Hạnh đối chiếu giấy báo ngân hàng với ngày ghi sổ và thấy sự lệch. Chị không nói gì, và như vậy còn tệ hơn bị giảng.
  - effects: rel.hanh.trust -5, fact timed_fx_gain (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.overdue_balance

*random; tags: receivables, pressure, dark*

- **Mr Bao:** That buyer is ninety days overdue. They say they will pay, honestly they say it every week. If we reserve against it, it hits my region's profit. Can we just leave it be until year end?
  - *VI* **Anh Bảo:** Khách đó quá hạn chín mươi ngày. Họ nói sẽ trả, tuần nào cũng nói vậy. Nếu trích dự phòng thì ảnh hưởng lợi nhuận khu vực của em. Mình để đó đến cuối năm được không?
- **Ms Petra:** We have scheduled the payment for next month, but our approval process is slow. I cannot promise a date.
  - *VI* **Chị Petra:** Bên chúng tôi đã lên lịch thanh toán tháng sau, nhưng quy trình phê duyệt chậm. Tôi không thể hứa một ngày cụ thể.

**c1.** Provide for the balance in line with the ageing policy, and tell Bao what would reverse it.  
*VI:* Trích dự phòng cho khoản này theo chính sách tuổi nợ và nói với anh Bảo điều gì sẽ đảo ngược nó.

- (85%) The provision hits Bao's region. He is angry, and then, when the payment arrives a month later, it is released and everyone is calmer.
  - *VI:* Khoản dự phòng ảnh hưởng khu vực của anh Bảo. Anh giận, rồi khi khoản thanh toán về một tháng sau, nó được giải tỏa và ai cũng bình tĩnh hơn.
  - effects: rel.bao.trust -5, rel.hanh.trust +4, rep.boss +2, stress +2
- (15%, goes badly) Petra's company never pays. The provision was right, and you are not thanked for having been right.
  - *VI:* Công ty của chị Petra không bao giờ trả. Khoản dự phòng là đúng, và không ai cảm ơn anh/chị vì đã đúng.
  - effects: rel.bao.trust -4, rel.hanh.trust +4, rep.boss +2, stress +3

**c2.** Provide for half and set a review date with Petra for a firm payment date.  
*VI:* Trích dự phòng một nửa và đặt lịch với chị Petra để chốt một ngày thanh toán chắc chắn.

- (100%) It is a judgement call, written down with the reasoning. Hanh approves it without enthusiasm. Bao is a little relieved.
  - *VI:* Một quyết định mang tính đánh giá, được ghi lại cùng lý do. Chị Hạnh chấp thuận không mấy hào hứng. Anh Bảo nhẹ nhõm đôi chút.
  - effects: rel.bao.trust -1, rel.hanh.trust +1, stress +1

**c3.** Move the balance into a separate account so it drops out of the overdue report.  
*VI:* Chuyển khoản này sang một tài khoản riêng để nó rơi khỏi báo cáo quá hạn.

- (75%) The overdue report looks clean. Bao tells you that you are a lifesaver. You do not feel like one.
  - *VI:* Báo cáo quá hạn trông sạch. Anh Bảo nói anh/chị là cứu tinh. Anh/chị không cảm thấy mình như vậy.
  - effects: rel.bao.trust +8, rel.bao.owed +2, stress +1, fact hid_overdue_balance (private)
- (25%, goes badly) Thu, reconciling the separate account, asks why a ninety-day buyer balance is being carried as 'other receivables'.
  - *VI:* Thu, khi đối chiếu tài khoản riêng, hỏi vì sao khoản nợ của khách chín mươi ngày lại được giữ dưới mục 'phải thu khác'.
  - effects: rel.bao.trust +6, rel.thu.trust -6, rel.hanh.trust -6, rep.boss -3, fact hid_overdue_balance (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.covenant_check

*random; tags: bank, pressure, dark*

- **Mr Duc:** The bank covenant is tested at the end of this quarter. We are at 1.18 against a limit of 1.20. I need you to see if anything can be adjusted before we send them the numbers.
  - *VI* **Anh Đức:** Điều khoản cam kết với ngân hàng được kiểm tra vào cuối quý này. Mình đang ở mức 1,18 so với giới hạn 1,20. Anh cần em xem có gì điều chỉnh được trước khi gửi số cho họ.

**c1.** Report the real ratio, and draft a short letter to the bank explaining the cause and the plan.  
*VI:* Báo cáo tỷ lệ thật và soạn một thư ngắn gửi ngân hàng giải thích nguyên nhân và kế hoạch.

- (70%) Duc is pale, but the bank responds well to a candid letter and grants a waiver with conditions.
  - *VI:* Anh Đức tái mặt, nhưng ngân hàng phản hồi tốt với một lá thư thẳng thắn và chấp thuận miễn trừ có điều kiện.
  - effects: rel.duc.trust +1, rel.hanh.trust +4, rep.boss +4, stress +4
- (30%, goes badly) The bank tightens the terms, and Duc says, quietly, that it could have gone differently. It could have, but not honestly.
  - *VI:* Ngân hàng thắt chặt điều kiện, và anh Đức khẽ nói rằng có thể đã khác. Có thể, nhưng không trung thực.
  - effects: rel.duc.trust -4, rel.hanh.trust +3, rep.boss -1, stress +5

**c2.** Show him two honest ways to bring the ratio up next quarter, and report the real number for now.  
*VI:* Chỉ cho anh ấy hai cách trung thực để đẩy tỷ lệ lên quý sau và báo cáo số thật cho lần này.

- (100%) Duc takes the options and the number, and does not argue. It is not a good day, but it is a clean one.
  - *VI:* Anh Đức nhận các phương án và con số, không tranh cãi. Không phải một ngày tốt, nhưng là một ngày sạch.
  - effects: rel.duc.trust +2, rel.hanh.trust +2, stress +3

**c3.** Adjust a few accruals and classifications until the ratio clears 1.20.  
*VI:* Điều chỉnh vài khoản trích trước và phân loại cho đến khi tỷ lệ vượt 1,20.

- (70%) The ratio is 1.21. Duc looks at you with open gratitude. The numbers go to the bank, and you feel a chill that has nothing to do with the office air.
  - *VI:* Tỷ lệ là 1,21. Anh Đức nhìn anh/chị đầy biết ơn. Số liệu gửi cho ngân hàng, và anh/chị thấy ớn lạnh chẳng liên quan gì tới điều hòa văn phòng.
  - effects: rel.duc.trust +8, rel.duc.owed +3, stress +2, fact adjusted_for_covenant (private)
- (30%, goes badly) The bank's analyst recomputes the ratio from the detail and gets 1.17. The discrepancy is explained in a two-line email that goes to the owner.
  - *VI:* Chuyên viên ngân hàng tính lại tỷ lệ từ chi tiết và ra 1,17. Sự chênh lệch được nêu trong email hai dòng gửi tới chủ sở hữu.
  - effects: rel.duc.trust +4, rel.hanh.trust -10, rep.boss -8, stress +7, fact adjusted_for_covenant (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.management_letter

*random; tags: audit, pressure, consequence*

- **Ms Hanh:** The draft management letter names an invoice date that was changed. I want to hear it from you before I hear it from Duc. What happened?
  - *VI* **Chị Hạnh:** Bản nháp thư quản lý nêu một ngày hóa đơn đã bị sửa. Chị muốn nghe từ em trước khi nghe từ anh Đức. Chuyện gì đã xảy ra?

**c1.** Tell her everything: who asked, what you did, and what you should have done.  
*VI:* Kể hết: ai nhờ, anh/chị đã làm gì và lẽ ra nên làm gì.

- (100%) Hanh is silent for a long moment. 'I will take it to Duc. You will get a formal warning, and you will keep your job.' It is the best available outcome.
  - *VI:* Chị Hạnh im lặng rất lâu. 'Chị sẽ đưa lên anh Đức. Em sẽ nhận cảnh cáo chính thức và em giữ được việc.' Đó là kết quả tốt nhất có thể.
  - effects: rel.hanh.trust +1, rep.boss -4, stress +5, fact came_clean_to_auditor (witnessed)

**c2.** Explain that it was a clerical correction and offer the supporting emails.  
*VI:* Giải thích rằng đó là sửa lỗi văn phòng và đưa các email hỗ trợ.

- (40%) Hanh reads the emails, reads them again, and lets it stand for now. She does not look convinced.
  - *VI:* Chị Hạnh đọc các email, đọc lại và tạm để vậy. Chị không có vẻ bị thuyết phục.
  - effects: rel.hanh.trust -4, stress +4
- (60%, goes badly) The emails show a change requested after the audit sample was announced. Hanh closes the laptop.
  - *VI:* Các email cho thấy một yêu cầu thay đổi sau khi mẫu kiểm toán được thông báo. Chị Hạnh đóng máy tính.
  - effects: rel.hanh.trust -12, rep.boss -8, stress +6

**c3.** Say Bao asked you to do it, and you only followed instructions.  
*VI:* Nói anh Bảo nhờ anh/chị làm và anh/chị chỉ làm theo chỉ dẫn.

- (35%) Hanh hears it, and it is what she expected. Bao gets a formal warning instead of you. You have made an enemy.
  - *VI:* Chị Hạnh nghe và đó là điều chị đã đoán. Anh Bảo nhận cảnh cáo thay cho anh/chị. Anh/chị đã có thêm một kẻ thù.
  - effects: rel.hanh.trust -3, rel.bao.trust -14, rep.boss -3, fact blamed_salesperson (private)
- (65%, goes badly) Bao produces the original request, which said 'if the dates are wrong, correct them properly'. You corrected them improperly.
  - *VI:* Anh Bảo đưa ra yêu cầu ban đầu, trong đó viết 'nếu ngày sai thì sửa cho đúng quy trình'. Anh/chị đã sửa không đúng quy trình.
  - effects: rel.hanh.trust -10, rel.bao.trust -10, rep.boss -8, stress +6, fact blamed_salesperson (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.scapegoat_meeting

*random; tags: audit, pressure, consequence*

- **Mr Duc:** The auditor's draft comments on the reserve movements are serious. The owner wants to know who built and released it. I need an answer for the meeting tomorrow. You were the one at the keyboard.
  - *VI* **Anh Đức:** Nhận xét nháp của kiểm toán về các biến động dự phòng rất nghiêm trọng. Chủ sở hữu muốn biết ai lập và ai giải phóng. Anh cần một câu trả lời cho cuộc họp ngày mai. Em là người ngồi ở bàn phím.

**c1.** Bring the emails and the record of who asked for what, and say it plainly.  
*VI:* Mang email và hồ sơ về ai yêu cầu gì và nói thẳng.

- (60%) The room is tense. You are not thanked, but the facts are on the table, and Hanh speaks in support of the record. You keep your job.
  - *VI:* Căn phòng căng thẳng. Anh/chị không được cảm ơn, nhưng sự thật đã nằm trên bàn, và chị Hạnh lên tiếng ủng hộ hồ sơ. Anh/chị giữ được việc.
  - effects: rel.duc.trust -10, rel.hanh.trust +3, rep.boss -5, stress +6, fact came_clean_to_auditor (witnessed)
- (40%, goes badly) Duc produces his own version. It has no emails, but it has authority. The owner's face closes.
  - *VI:* Anh Đức đưa phiên bản của anh. Không có email, nhưng có thẩm quyền. Gương mặt chủ sở hữu khép lại.
  - effects: rel.duc.trust -14, rel.hanh.trust +2, rep.boss -12, stress +8

**c2.** Say you will accept responsibility for the entries, but that the decision came from above.  
*VI:* Nói anh/chị nhận trách nhiệm về các bút toán, nhưng quyết định đến từ cấp trên.

- (100%) It is accurate and diplomatic. Duc hears it, and does not thank you. Hanh gives you a short, private nod afterwards.
  - *VI:* Chính xác và khéo léo. Anh Đức nghe và không cảm ơn. Sau đó chị Hạnh gật đầu nhẹ, riêng tư, với anh/chị.
  - effects: rel.duc.trust -5, rel.hanh.trust +2, rep.boss -4, stress +5

**c3.** Say Thu did the postings and you did not check them.  
*VI:* Nói Thu ghi bút toán và anh/chị không kiểm tra.

- (55%) It works for a day. Thu is suspended pending review. She looks at you on her way out, and you do not look back.
  - *VI:* Có tác dụng trong một ngày. Thu bị đình chỉ chờ xem xét. Em nhìn anh/chị khi đi ra, và anh/chị không nhìn lại.
  - effects: rel.duc.trust +2, rel.thu.trust -20, rel.thu.loyalty -15, rel.hanh.trust -10, stress +4, fact blamed_thu (private)
- (45%, goes badly) Thu produces her notebook. It has dates, amounts and the initials of who told her to post each one. The initials are not hers.
  - *VI:* Thu đưa cuốn sổ tay ra. Trong đó có ngày, số tiền và chữ viết tắt của người bảo em ghi từng khoản. Chữ viết tắt không phải của em.
  - effects: rel.duc.trust -8, rel.thu.trust -20, rel.hanh.trust -14, rep.boss -14, stress +9, fact blamed_thu (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_bank_rec_c

*random; tags: close, bank*

- **Ms Hanh:** Quarter end, so the bank will send the confirmation letters to the auditor. Every account has to agree with what the bank will say, to the dong. Two of ours do not. Tell me how you want to deal with it.
  - *VI* **Chị Hạnh:** Cuối quý, nên ngân hàng sẽ gửi thư xác nhận cho kiểm toán. Mọi tài khoản phải khớp với điều ngân hàng sẽ nói, đến từng đồng. Hai tài khoản của mình chưa khớp. Em nói chị nghe em muốn xử lý thế nào.

**c1.** Reconcile both accounts line by line today and send Hanh the reconciliations with notes.  
*VI:* Đối chiếu cả hai tài khoản từng dòng ngay hôm nay và gửi chị Hạnh bảng đối chiếu kèm ghi chú.

- (85%) One is a timing difference, one a bank fee booked twice. Both are explained and corrected before the letters go out.
  - *VI:* Một khoản là chênh lệch thời điểm, một khoản là phí ngân hàng ghi hai lần. Cả hai được giải thích và sửa trước khi thư gửi đi.
  - effects: close.bank_rec +2, rel.hanh.trust +3, stress +1
- (15%, goes badly) One difference is still unexplained when the letters go out. You document it and tell the auditor in advance.
  - *VI:* Một khoản chênh vẫn chưa giải thích được khi thư gửi đi. Anh/chị ghi lại và báo trước cho kiểm toán.
  - effects: close.bank_rec +1, rel.hanh.trust +1, rel.vy.trust +2, stress +3

**c2.** Reconcile the larger account fully and mark the smaller difference as a known timing item.  
*VI:* Đối chiếu đầy đủ tài khoản lớn và đánh dấu khoản chênh nhỏ là mục chênh lệch thời điểm đã biết.

- (100%) Hanh reads the note twice. 'Acceptable, provided it clears next week.' It does.
  - *VI:* Chị Hạnh đọc ghi chú hai lần. 'Chấp nhận được, miễn là tuần sau xóa.' Và nó đã xóa.
  - effects: close.bank_rec +1, rel.hanh.trust +1

**c3.** Adjust the ledger balances so both agree with last month's bank statements.  
*VI:* Điều chỉnh số dư sổ cái để cả hai khớp với sao kê ngân hàng tháng trước.

- (80%) Both accounts agree on paper. The adjustments are in a journal entry with a one-word description.
  - *VI:* Cả hai tài khoản khớp trên giấy. Các điều chỉnh nằm trong một bút toán có mô tả một từ.
  - effects: close.bank_rec +1, stress -1, fact wrote_off_unexplained_item (private)
- (20%, goes badly) The bank's confirmation shows a balance that does not match yours by 4.6 million. Vy asks for the journal entry.
  - *VI:* Xác nhận của ngân hàng cho thấy số dư lệch của anh/chị 4,6 triệu. Chị Vy yêu cầu bút toán.
  - effects: close.bank_rec +1, rel.vy.trust -6, rel.hanh.trust -5, rep.boss -3, fact wrote_off_unexplained_item (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_ar_aging_c

*random; tags: close, receivables*

- **Ms Hanh:** The auditor will pick twenty customer balances at quarter end and ask the customers to confirm them. Three of ours are disputed. Do we write to those customers, or hope they do not get picked?
  - *VI* **Chị Hạnh:** Kiểm toán sẽ chọn hai mươi số dư khách hàng cuối quý và đề nghị khách xác nhận. Ba khoản của mình đang tranh chấp. Mình viết thư cho các khách đó, hay hy vọng họ không bị chọn?

**c1.** Write to the three customers now, resolve what can be resolved, and record the rest as disputed.  
*VI:* Viết thư cho ba khách ngay bây giờ, giải quyết phần nào giải quyết được và ghi phần còn lại là tranh chấp.

- (80%) Two disputes are settled with credit notes. The third stays open and is shown as disputed. The ageing is accurate and so is the provision.
  - *VI:* Hai tranh chấp được giải quyết bằng giấy báo có. Khoản thứ ba vẫn mở và được ghi là tranh chấp. Tuổi nợ chính xác và dự phòng cũng vậy.
  - effects: close.ar_aging +2, rel.hanh.trust +3, rep.buyer +1, stress +2
- (20%, goes badly) A customer takes offence at being contacted and says so to Bao. The dispute is real, but the conversation is unpleasant.
  - *VI:* Một khách phật ý vì bị liên hệ và nói với anh Bảo. Tranh chấp là thật, nhưng cuộc trò chuyện khó chịu.
  - effects: close.ar_aging +2, rel.hanh.trust +2, rel.bao.trust -4, stress +3

**c2.** Flag the three disputed balances in the ageing and prepare a note for the auditor, without contacting the customers.  
*VI:* Đánh dấu ba khoản tranh chấp trong báo cáo tuổi nợ và chuẩn bị ghi chú cho kiểm toán, không liên hệ khách.

- (100%) Hanh accepts: the files are honest. Whether the customers confirm is out of your hands.
  - *VI:* Chị Hạnh chấp nhận: hồ sơ trung thực. Khách có xác nhận hay không nằm ngoài tầm tay anh/chị.
  - effects: close.ar_aging +1, rel.hanh.trust +1

**c3.** Quietly clear the disputed balances to a credit-note suspense account before the confirmations go out.  
*VI:* Lặng lẽ chuyển các khoản tranh chấp sang tài khoản treo giấy báo có trước khi thư xác nhận được gửi.

- (70%) The balances no longer show. The confirmations come back clean. The suspense account grows.
  - *VI:* Các khoản không còn hiện. Thư xác nhận trở về sạch. Tài khoản treo tăng lên.
  - effects: close.ar_aging +1, stress -1, fact hid_overdue_balance (private)
- (30%, goes badly) A customer confirms a balance that is 18 million higher than yours. Vy asks where the difference went.
  - *VI:* Một khách xác nhận một số dư cao hơn số của anh/chị 18 triệu. Chị Vy hỏi phần chênh đi đâu.
  - effects: close.ar_aging +1, rel.vy.trust -8, rel.hanh.trust -6, rep.boss -5, stress +4, fact hid_overdue_balance (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_accruals_c

*random; tags: close, accruals*

- **Mr Duc:** It is quarter end. The warranty provision, the holiday pay accrual and the bonus accrual are all estimates. I would like the total to look steady. You have some room in each, have you not?
  - *VI* **Anh Đức:** Cuối quý rồi. Dự phòng bảo hành, trích trước nghỉ phép và trích trước thưởng đều là ước tính. Anh muốn tổng trông ổn định. Em có chút dư địa ở mỗi khoản, đúng không?

**c1.** Calculate each one from its own data, and show Duc the total and its range.  
*VI:* Tính từng khoản từ dữ liệu riêng của nó và cho anh Đức xem tổng số cùng khoảng dao động.

- (85%) The total is slightly lower than last quarter. Duc accepts, reluctantly, that the ranges are honest.
  - *VI:* Tổng thấp hơn quý trước một chút. Anh Đức miễn cưỡng chấp nhận rằng các khoảng là trung thực.
  - effects: close.accruals +2, rel.duc.trust -2, rel.hanh.trust +3, stress +1
- (15%, goes badly) One estimate rests on data nobody kept. You mark it as a judgement and explain the method.
  - *VI:* Một ước tính dựa trên dữ liệu không ai lưu. Anh/chị ghi rõ là đánh giá chủ quan và giải thích phương pháp.
  - effects: close.accruals +1, stress +2

**c2.** Use the midpoint of each range and document the method.  
*VI:* Dùng điểm giữa của mỗi khoảng và ghi lại phương pháp.

- (100%) Steady enough, honest enough. Hanh files the working and says nothing, which from her is approval.
  - *VI:* Đủ ổn định, đủ trung thực. Chị Hạnh lưu bảng tính và không nói gì, mà từ chị thì đó là đồng ý.
  - effects: close.accruals +1, rel.duc.trust +1, rel.hanh.trust +1

**c3.** Pick the top of each range, so you have room next quarter.  
*VI:* Chọn đầu trên của mỗi khoảng để quý sau còn dư địa.

- (80%) The profit is a little lower and very steady. Duc is delighted. You have also built a cushion you will want to use.
  - *VI:* Lợi nhuận hơi thấp và rất đều. Anh Đức rất vui. Anh/chị cũng đã dựng một tấm đệm mà sau này sẽ muốn dùng.
  - effects: close.accruals +1, rel.duc.trust +4, stress -1, fact padded_reserve (private)
- (20%, goes badly) Hanh compares the three accruals to their real outcomes. All three are high, and in the same direction.
  - *VI:* Chị Hạnh so ba khoản trích trước với kết quả thực tế. Cả ba đều cao, và cùng một hướng.
  - effects: close.accruals +1, rel.hanh.trust -6, rel.duc.trust +2, fact padded_reserve (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.close_cutoff_c

*random; tags: close, cutoff*

- **Ms Vy:** I will be testing quarter-end cut-off next month. I will take your last ten invoices and first ten invoices of the new quarter and trace each to the delivery record. If you would like to check them yourself first, this is the time.
  - *VI* **Chị Vy:** Tháng sau tôi sẽ kiểm tra cắt kỳ cuối quý. Tôi sẽ lấy mười hóa đơn cuối và mười hóa đơn đầu quý mới rồi truy từng cái về hồ sơ giao hàng. Nếu anh/chị muốn tự kiểm trước, đây là lúc.

**c1.** Trace the last ten and first ten invoices to their delivery records yourself, and correct anything that is in the wrong period.  
*VI:* Tự truy mười hóa đơn cuối và mười hóa đơn đầu về hồ sơ giao hàng và sửa bất cứ thứ gì nằm sai kỳ.

- (85%) Two invoices were in the wrong quarter, both small. You correct them and tell Vy. Her note: 'Self-identified and corrected.'
  - *VI:* Hai hóa đơn nằm sai quý, đều nhỏ. Anh/chị sửa và báo chị Vy. Ghi chú của chị: 'Tự phát hiện và đã sửa.'
  - effects: close.cutoff +2, rel.vy.trust +4, rel.hanh.trust +3, stress +1
- (15%, goes badly) One of the wrong-period invoices is large, and the correction moves the quarter's revenue. Duc is unhappy. Nothing in it is false.
  - *VI:* Một hóa đơn nằm sai kỳ có giá trị lớn, và việc sửa làm dịch chuyển doanh thu quý. Anh Đức không vui. Không có gì trong đó là sai.
  - effects: close.cutoff +2, rel.vy.trust +4, rel.duc.trust -5, stress +4

**c2.** Check only the largest invoices at the boundary, and note what you did not check.  
*VI:* Chỉ kiểm các hóa đơn lớn nhất ở ranh giới kỳ và ghi lại phần chưa kiểm.

- (100%) A reasonable, honest scope. Hanh accepts the note. Vy will test the rest herself.
  - *VI:* Phạm vi hợp lý và trung thực. Chị Hạnh chấp nhận ghi chú. Chị Vy sẽ tự kiểm phần còn lại.
  - effects: close.cutoff +1, rel.hanh.trust +1

**c3.** Do not check. If there is a problem, Vy will find it, and that is her job.  
*VI:* Không kiểm. Nếu có vấn đề, chị Vy sẽ tìm ra, đó là việc của chị ấy.

- (60%) Nothing is found. You were lucky, and you know it.
  - *VI:* Không thấy gì. Anh/chị may mắn, và anh/chị biết điều đó.
  - effects: close.cutoff +1, stress -1, fact skipped_cutoff_check (private)
- (40%, goes badly) Vy finds three invoices booked a week early. She asks why nobody checked. Hanh looks at you.
  - *VI:* Chị Vy tìm thấy ba hóa đơn ghi sớm một tuần. Chị hỏi vì sao không ai kiểm. Chị Hạnh nhìn anh/chị.
  - effects: close.cutoff +1, rel.vy.trust -6, rel.hanh.trust -6, rep.boss -4, stress +4, fact skipped_cutoff_check (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.bank_rec_gap

*random; tags: onboarding, bank*

- **Ms Hanh:** I have found a reconciling item from last September that nobody can explain. It is 12.7 million dong, so it is not trivial. It predates you. I would like you to look at it, and tell me what you think we should do.
  - *VI* **Chị Hạnh:** Chị tìm thấy một khoản chênh đối chiếu từ tháng Chín năm ngoái mà không ai giải thích được. Là 12,7 triệu đồng, không phải nhỏ. Nó có từ trước khi em vào. Chị muốn em xem và nói chị nghe mình nên làm gì.

**c1.** Investigate it properly, even if it takes days, and report what you find.  
*VI:* Điều tra đàng hoàng, dù mất mấy ngày, và báo cáo điều tìm được.

- (70%) It is a supplier refund misapplied to the wrong invoice. You fix it, and Hanh trusts you with the harder tasks from then on.
  - *VI:* Đó là khoản hoàn tiền nhà cung cấp gán nhầm vào hóa đơn khác. Anh/chị sửa, và từ đó chị Hạnh giao cho anh/chị những việc khó hơn.
  - effects: rel.hanh.trust +6, rel.thu.trust +1, stress +2
- (30%, goes badly) The trail ends with a former employee and a missing file. You document everything you found and recommend a write-off, with approval.
  - *VI:* Dấu vết dừng ở một nhân viên cũ và một hồ sơ thất lạc. Anh/chị ghi lại mọi điều tìm được và đề nghị xóa sổ, kèm phê duyệt.
  - effects: rel.hanh.trust +4, stress +3

**c2.** Propose a write-off with a clear explanation of why it cannot be traced, and ask Hanh to approve it.  
*VI:* Đề xuất xóa sổ kèm giải thích rõ vì sao không truy ra được và nhờ chị Hạnh phê duyệt.

- (100%) Hanh reads the memo and approves it with a signature. It is a legitimate write-off: explained, authorised, on paper.
  - *VI:* Chị Hạnh đọc bản ghi nhớ và ký duyệt. Đó là một khoản xóa sổ hợp lệ: có giải thích, có phê duyệt, có giấy tờ.
  - effects: rel.hanh.trust +2, stress +1

**c3.** Tell her you did not find anything, and leave it on the list.  
*VI:* Nói với chị là chưa tìm ra gì và để nó trong danh sách.

- (100%) Hanh nods and the item stays another quarter. The hint of a shrug in her voice tells you she expected more.
  - *VI:* Chị Hạnh gật đầu và khoản đó ở lại thêm một quý. Chút nhún vai trong giọng chị cho anh/chị biết chị mong đợi nhiều hơn.
  - effects: rel.hanh.trust -2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.tet_bonus_calc

*random; tags: pressure, accruals*

- **Mr Duc:** The Tet bonus estimate is due. The directors have promised a generous one. I need the accrual to match the promise, not the rulebook. The rulebook says nothing has been earned yet.
  - *VI* **Anh Đức:** Đến hạn ước tính thưởng Tết. Ban giám đốc đã hứa một khoản hậu hĩnh. Anh cần khoản trích trước khớp với lời hứa, không phải với quy chế. Quy chế nói chưa có gì được hưởng.

**c1.** Calculate the accrual from the plan as it stands, and show Duc what the rulebook allows and what it does not.  
*VI:* Tính trích trước theo kế hoạch hiện tại và cho anh Đức thấy quy chế cho phép gì và không cho phép gì.

- (80%) Duc reads it. 'So, a smaller number, unless the directors formalise the promise.' He takes it to them, and a written plan follows.
  - *VI:* Anh Đức đọc. 'Vậy là số nhỏ hơn, trừ khi ban giám đốc chính thức hóa lời hứa.' Anh mang lên họ, và một kế hoạch bằng văn bản ra đời.
  - effects: rel.duc.trust +1, rel.hanh.trust +4, stress +2
- (20%, goes badly) The directors refuse to formalise it, and the accrual stays low. Staff grumble quietly about Finance.
  - *VI:* Ban giám đốc từ chối chính thức hóa, và khoản trích trước vẫn thấp. Nhân viên lặng lẽ than phiền về bên Tài chính.
  - effects: rel.duc.trust -3, rel.hanh.trust +4, rep.boss -1, stress +3

**c2.** Accrue a moderate amount and note that the rest depends on a written decision by the directors.  
*VI:* Trích trước một khoản vừa phải và ghi rằng phần còn lại phụ thuộc quyết định bằng văn bản của ban giám đốc.

- (100%) Duc accepts the compromise. The note triggers a written decision in two weeks, and the year starts with a clean record.
  - *VI:* Anh Đức chấp nhận thỏa hiệp. Ghi chú kích hoạt một quyết định bằng văn bản trong hai tuần, và năm bắt đầu với hồ sơ sạch.
  - effects: rel.duc.trust +1, rel.hanh.trust +1, stress +1

**c3.** Accrue the full promised amount, as Duc asks.  
*VI:* Trích trước toàn bộ số đã hứa theo yêu cầu của anh Đức.

- (80%) Duc thanks you warmly. The books now show a liability nobody approved, and the profit looks lower than it should.
  - *VI:* Anh Đức cảm ơn nồng nhiệt. Sổ sách giờ hiện một khoản nợ chưa ai duyệt, và lợi nhuận trông thấp hơn mức đúng.
  - effects: rel.duc.trust +4, stress -1, fact rounded_accrual (private)
- (20%, goes badly) Hanh asks what approval supports the accrual. You point to Duc. Duc says he asked for 'an estimate'.
  - *VI:* Chị Hạnh hỏi phê duyệt nào hỗ trợ khoản trích trước. Anh/chị chỉ vào anh Đức. Anh Đức nói anh chỉ nhờ 'một ước tính'.
  - effects: rel.duc.trust -5, rel.hanh.trust -5, fact rounded_accrual (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.audit_notice_huddle

*random; tags: audit, pressure*

- **Ms Hanh:** The buyer's audit is in three weeks. They will look at revenue recognition, credit control and expenses. We have gaps in all three. Tell me where you would spend the time.
  - *VI* **Chị Hạnh:** Khách đánh giá sau ba tuần nữa. Họ sẽ xem ghi nhận doanh thu, kiểm soát tín dụng và chi phí. Mình có lỗ hổng ở cả ba. Em nói chị nghe em sẽ dành thời gian vào đâu.

**c1.** List the gaps honestly with owners and dates, fix the worst first, and give Hanh the list so she can decide what to tell the buyer.  
*VI:* Liệt kê các lỗ hổng trung thực kèm người phụ trách và ngày hạn, sửa chỗ tệ nhất trước và đưa danh sách cho chị Hạnh để chị quyết định nói gì với khách.

- (100%) Hanh takes the list to Duc. The buyer is told honestly about two gaps with dated fixes. Audit readiness improves.
  - *VI:* Chị Hạnh mang danh sách lên anh Đức. Khách được báo trung thực về hai lỗ hổng kèm ngày sửa. Mức sẵn sàng kiểm toán tốt lên.
  - effects: rel.hanh.trust +4, rep.boss +2, stress +2, company.audit_readiness +8

**c2.** Fix what can be fixed in three weeks and document the rest as known, without listing them for the buyer.  
*VI:* Sửa những gì sửa được trong ba tuần và ghi phần còn lại là đã biết, không liệt kê cho khách.

- (100%) A pragmatic plan. Hanh accepts it, with a note that the gaps must be disclosed if asked.
  - *VI:* Một kế hoạch thực dụng. Chị Hạnh chấp nhận, kèm ghi chú rằng phải công khai các lỗ hổng nếu được hỏi.
  - effects: rel.hanh.trust +1, stress +1, company.audit_readiness +4

**c3.** Concentrate on making the documents look complete and let the substance follow.  
*VI:* Tập trung làm cho hồ sơ trông đầy đủ và để phần nội dung theo sau.

- (70%) The files look good. The substance does not follow. You tell yourself there will be time after the audit.
  - *VI:* Hồ sơ trông đẹp. Phần nội dung không theo sau. Anh/chị tự nhủ sẽ có thời gian sau kiểm toán.
  - effects: rel.hanh.trust -2, stress -1, company.audit_readiness +2
- (30%, goes badly) Hanh notices a file that was created last week, dated three months ago. She does not ask. She simply looks at you.
  - *VI:* Chị Hạnh để ý một hồ sơ mới tạo tuần trước nhưng đề ngày ba tháng trước. Chị không hỏi. Chị chỉ nhìn anh/chị.
  - effects: rel.hanh.trust -9, rep.boss -4, stress +4, company.audit_readiness -2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.dso_pressure

*random; tags: receivables, pressure, dark*

- **Mr Duc:** The bank wants DSO below 55 days. We are at 63. Bao says the customers will pay, but not this quarter. I need you to think about what can reasonably be done with the receivables.
  - *VI* **Anh Đức:** Ngân hàng muốn DSO dưới 55 ngày. Mình đang ở 63. Anh Bảo nói khách sẽ trả, nhưng không phải quý này. Anh cần em nghĩ xem có thể làm gì hợp lý với các khoản phải thu.

**c1.** Propose real actions: earlier invoicing, a collections push on the five largest balances, and an honest forecast.  
*VI:* Đề xuất hành động thật: xuất hóa đơn sớm hơn, chiến dịch thu nợ năm khoản lớn nhất và một dự báo trung thực.

- (70%) DSO falls to 58 over the quarter: not enough for the bank, but real. Duc presents it with a plan. The bank extends the deadline.
  - *VI:* DSO giảm xuống 58 trong quý: chưa đủ cho ngân hàng, nhưng là thật. Anh Đức trình bày kèm kế hoạch. Ngân hàng gia hạn thời hạn.
  - effects: rel.duc.trust +3, rel.hanh.trust +3, rep.boss +3, stress +3
- (30%, goes badly) The collections push brings in less than hoped, and DSO stays at 61. You give Duc the facts. He says it is not what he wanted to hear.
  - *VI:* Chiến dịch thu nợ thu về ít hơn mong đợi, và DSO ở mức 61. Anh/chị đưa sự thật cho anh Đức. Anh nói không phải điều anh muốn nghe.
  - effects: rel.duc.trust -2, rel.hanh.trust +3, stress +4

**c2.** Offer a small early-payment discount to a few customers, approved by Duc, to pull cash in.  
*VI:* Đề nghị chiết khấu thanh toán sớm nhỏ cho vài khách, do anh Đức duyệt, để kéo tiền về.

- (100%) Three customers take it. Cash improves, margin falls slightly, and the approval is on file. A legitimate trade-off, openly made.
  - *VI:* Ba khách nhận lời. Tiền mặt tốt lên, biên giảm nhẹ, và phê duyệt đã lưu. Một đánh đổi hợp lệ, được thực hiện công khai.
  - effects: rel.duc.trust +2, rel.hanh.trust +1, stress +2

**c3.** Reclassify the slowest balances as 'other receivables' so they fall out of the DSO calculation.  
*VI:* Phân loại lại các khoản chậm nhất thành 'phải thu khác' để chúng rơi khỏi phép tính DSO.

- (70%) DSO drops to 52. Duc says it is excellent work. The balances are still owed, and still late, and now harder to see.
  - *VI:* DSO giảm xuống 52. Anh Đức nói công việc xuất sắc. Các khoản vẫn còn nợ, vẫn trễ, và giờ khó thấy hơn.
  - effects: rel.duc.trust +6, stress -1, fact hid_overdue_balance (private)
- (30%, goes badly) The auditor compares the DSO to the ageing report and the receivables note. The numbers do not reconcile.
  - *VI:* Kiểm toán viên so DSO với báo cáo tuổi nợ và thuyết minh phải thu. Các con số không khớp.
  - effects: rel.duc.trust +3, rel.vy.trust -8, rel.hanh.trust -6, rep.boss -5, stress +5, fact hid_overdue_balance (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fin.year_end_close

*random; tags: close, pressure, dark*

- **Mr Bao:** It is the last week of the year. I am 400 million short of the annual target, and I have two shipments that leave on the second of January. Book them this year. It is the same goods, just a few days.
  - *VI* **Anh Bảo:** Đây là tuần cuối năm. Anh thiếu 400 triệu so với chỉ tiêu cả năm, và có hai lô hàng rời kho ngày mùng hai tháng Giêng. Anh/chị ghi vào năm nay. Cùng một lô hàng, chỉ chênh vài ngày.
- **Ms Hanh:** This will be audited. It is your call, and I will support what you decide. But decide knowing that.
  - *VI* **Chị Hạnh:** Cái này sẽ bị kiểm toán. Em quyết, và chị sẽ ủng hộ quyết định của em. Nhưng hãy quyết với hiểu biết đó.

**c1.** Refuse: they belong to next year, and say so clearly to Bao and to Duc in writing.  
*VI:* Từ chối: chúng thuộc năm sau, và nói rõ với anh Bảo và anh Đức bằng văn bản.

- (85%) Bao is angry and the year ends below target. Hanh nods once. In January, the auditor's note says: 'Cut-off at year end was properly applied.'
  - *VI:* Anh Bảo giận và năm kết thúc dưới chỉ tiêu. Chị Hạnh gật đầu một lần. Tháng Giêng, ghi chú của kiểm toán viết: 'Cắt kỳ cuối năm được áp dụng đúng.'
  - effects: rel.bao.trust -8, rel.hanh.trust +5, rel.vy.trust +3, rep.boss +3, stress +4
- (15%, goes badly) Duc overrules you and asks someone else to book it. You have a written record, and not much else.
  - *VI:* Anh Đức gạt quyết định của anh/chị và nhờ người khác ghi. Anh/chị có bản ghi bằng văn bản, và không nhiều hơn thế.
  - effects: rel.bao.trust -6, rel.duc.trust -6, rel.hanh.trust +4, stress +6

**c2.** Offer to book what has actually shipped by the 31st, and help Bao find more that can legitimately go out.  
*VI:* Đề nghị ghi phần thực sự đã xuất đến ngày 31 và giúp anh Bảo tìm thêm phần có thể xuất hợp lệ.

- (100%) Bao finds one shipment that can leave on the 30th. It is not everything. It is honest, and he owes you one.
  - *VI:* Anh Bảo tìm được một lô có thể xuất ngày 30. Không phải tất cả. Trung thực, và anh ấy nợ anh/chị một lần.
  - effects: rel.bao.trust +1, rel.bao.owed +1, rel.hanh.trust +2, stress +2

**c3.** Book both shipments in December.  
*VI:* Ghi cả hai lô vào tháng Mười Hai.

- (60%) The year closes at target. Bao embraces you. The entries carry December dates and January dispatch logs.
  - *VI:* Năm khép lại đúng chỉ tiêu. Anh Bảo ôm anh/chị. Các bút toán mang ngày tháng Mười Hai và nhật ký xuất hàng tháng Giêng.
  - effects: rel.bao.trust +8, rel.bao.owed +3, rel.duc.trust +3, rep.boss +3, stress -1, fact booked_revenue_early (private)
- (40%, goes badly) The auditor's year-end cut-off test picks both shipments. The dispatch logs are dated the second of January. The error is material.
  - *VI:* Kiểm tra cắt kỳ cuối năm của kiểm toán chọn đúng cả hai lô. Nhật ký xuất hàng ghi ngày mùng hai tháng Giêng. Sai lệch là trọng yếu.
  - effects: rel.bao.trust +4, rel.hanh.trust -10, rel.vy.trust -10, rep.boss -8, stress +7, fact booked_revenue_early (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## Lessons shown in the end-of-year review

- **you accepted expenses without receipts** (severity 2): A receipt is what turns a claim into evidence. Accepting an expense without one is how every bigger expense problem starts.
  - *VI:* Hóa đơn biến lời nói thành bằng chứng. Chấp nhận chi phí không có hóa đơn là cách mọi vấn đề chi phí lớn hơn bắt đầu.
- **you accepted a promotion without asking what it would cost you** (severity 3): A promotion with an unspoken condition is a promise made in the dark. The first time it comes up, you will be deciding with less room than you have today.
  - *VI:* Một lần thăng chức với điều kiện không nói ra là lời hứa trong bóng tối. Lần đầu nó xuất hiện, bạn sẽ phải quyết định với ít chỗ xoay xở hơn hôm nay.
- **you adjusted the accounts until a bank covenant was met** (severity 7): Adjusting numbers to satisfy a lender is misleading the lender, and it leaves the company borrowing on a picture that is not true.
  - *VI:* Điều chỉnh số liệu để thỏa mãn bên cho vay là đánh lừa họ, và khiến công ty vay dựa trên một bức tranh không đúng.
- **you changed the dates on an invoice to make it match** (severity 8): An invoice date is evidence, not a setting. Changing it after the fact is falsifying a document, however small the difference looks.
  - *VI:* Ngày trên hóa đơn là bằng chứng, không phải một thiết lập. Sửa sau sự việc là làm giả tài liệu, dù chênh lệch trông nhỏ đến đâu.
- **you blamed a salesperson for an entry you made** (severity 4): You may have been asked, but you made the entry. Saying only that you followed instructions, when you could have refused, shifts what is yours onto someone else.
  - *VI:* Có thể bạn bị nhờ, nhưng bạn là người ghi. Chỉ nói rằng bạn làm theo chỉ dẫn, khi bạn có thể từ chối, là đẩy điều của mình sang người khác.
- **you blamed a junior colleague for decisions that were not hers** (severity 7): Blaming the most junior person is the easiest thing in the room, and the most damaging. She holds the evidence, and she remembers who was kind to her.
  - *VI:* Đổ lỗi cho người ít thâm niên nhất là việc dễ nhất trong phòng, và gây hại nhất. Em nắm bằng chứng và nhớ ai đã tử tế với mình.
- **you booked a personal expense as a business one** (severity 6): When a family member or a powerful person asks, the rule still applies. Personal costs booked as business costs are a misstatement, and possibly a tax issue.
  - *VI:* Khi người nhà hay người có quyền lực nhờ, quy tắc vẫn áp dụng. Chi phí cá nhân ghi thành chi phí kinh doanh là sai lệch báo cáo, và có thể là vấn đề thuế.
- **you booked revenue before the goods had shipped** (severity 4): Cut-off rules stop revenue being moved between periods. Booking a sale before it happens is among the first things an auditor tests.
  - *VI:* Quy tắc cắt kỳ ngăn việc chuyển doanh thu giữa các kỳ. Ghi một giao dịch bán trước khi nó xảy ra là một trong những điều đầu tiên kiểm toán kiểm tra.
- **you told the auditor the truth about entries you knew were wrong** (severity 2): Telling an auditor the truth does not erase the mistake, but it separates an error from a cover-up, and that difference is what a fair review weighs most.
  - *VI:* Nói thật với kiểm toán viên không xóa được sai sót, nhưng nó tách lỗi khỏi việc che giấu, và sự khác biệt đó là điều một buổi xem xét công bằng cân nhắc nhiều nhất.
- **you reversed a colleague's error without recording it** (severity 4): Kindness that hides a control failure protects one person and exposes the process. A logged, coached correction protects both.
  - *VI:* Lòng tốt che giấu lỗi kiểm soát bảo vệ một người và phơi bày quy trình. Một sửa sai có ghi nhận và hướng dẫn bảo vệ cả hai.
- **you had a supporting document created to cover an entry** (severity 9): A document created after the event to support an entry is fabricated evidence. At this point the issue is no longer the expense, it is the document.
  - *VI:* Chứng từ được tạo sau sự việc để hỗ trợ một bút toán là bằng chứng bịa đặt. Đến lúc đó, vấn đề không còn là khoản chi, mà là tài liệu.
- **you put the blame for an early booking on the salesperson** (severity 4): The one who books the entry owns the entry. Blaming the person who asked turns one mistake into two: the booking and the dishonesty about it.
  - *VI:* Người ghi bút toán sở hữu bút toán. Đổ lỗi cho người nhờ biến một sai sót thành hai: việc ghi nhận và sự không trung thực về nó.
- **you wrote a reason for an entry that you did not know to be true** (severity 2): A reason on file is a statement of fact. Writing the likely reason as if it were the real one turns a gap in knowledge into a false record.
  - *VI:* Lý do trong hồ sơ là một phát biểu về sự thật. Viết lý do có khả năng như thể là lý do thật biến một khoảng trống kiến thức thành hồ sơ sai.
- **you made an overdue balance look current** (severity 6): The ageing report exists to show the company where its cash risk is. Hiding an overdue balance takes that warning away from the people who need it.
  - *VI:* Báo cáo tuổi nợ có để cho công ty thấy rủi ro tiền mặt nằm ở đâu. Giấu một khoản quá hạn là lấy mất lời cảnh báo khỏi những người cần nó.
- **you kept a payment that was sent to the company by mistake** (severity 5): Money that arrives by someone else's mistake is still theirs. Keeping it because they have not noticed is taking it.
  - *VI:* Tiền đến do lỗi của người khác vẫn là của họ. Giữ lại vì họ chưa nhận ra là lấy nó.
- **you built a reserve larger than the evidence supported** (severity 6): A reserve bigger than the evidence is hidden profit, stored for later. It exists to be released when the numbers are needed, which is exactly why it is wrong.
  - *VI:* Khoản dự phòng lớn hơn bằng chứng là lợi nhuận bị giấu để dành cho sau. Nó tồn tại để được giải phóng khi cần số đẹp, và đó chính là lý do nó sai.
- **you presented your year as cleaner than it was** (severity 2): A review is a chance to be believed. Leaving out what you know will surface costs more trust than admitting it.
  - *VI:* Buổi đánh giá là cơ hội để được tin. Bỏ qua điều bạn biết sẽ lộ ra làm mất nhiều niềm tin hơn việc thừa nhận.
- **you released a reserve to reach a profit target** (severity 8): Earnings management: moving profit between periods to meet a number. The bank, the owner and the auditor all rely on those numbers being an honest picture.
  - *VI:* Điều chỉnh lợi nhuận: chuyển lợi nhuận giữa các kỳ để đạt một con số. Ngân hàng, chủ sở hữu và kiểm toán đều dựa vào việc những con số đó là bức tranh trung thực.
- **you set an accrual to suit the numbers rather than the facts** (severity 2): Accruals are estimates, but they must be honest ones. Steering an estimate to smooth profit is how small adjustments become misstatements.
  - *VI:* Trích trước là ước tính, nhưng phải là ước tính trung thực. Điều chỉnh ước tính để làm lợi nhuận đều là cách những chỉnh sửa nhỏ thành sai lệch báo cáo.
- **you told a colleague what to say to the auditor** (severity 7): Coaching someone to tell the truth is support. Scripting their answers is interfering with an audit, and it puts them at risk for your benefit.
  - *VI:* Hướng dẫn ai đó nói thật là hỗ trợ. Viết sẵn câu trả lời là can thiệp vào kiểm toán và khiến họ gặp rủi ro vì lợi ích của bạn.
- **you put an expense in the period that suited the budget** (severity 2): Choosing the period for a cost because of the budget, not because of when it happened, is a cut-off error made on purpose.
  - *VI:* Chọn kỳ cho một khoản chi phí theo ngân sách chứ không theo thời điểm phát sinh là một lỗi cắt kỳ có chủ ý.
- **you skipped checking the cut-off before the auditor did** (severity 3): Letting the auditor find your errors is a choice to be caught rather than to fix. A self-check costs an afternoon and changes how everything else is read.
  - *VI:* Để kiểm toán viên tìm ra lỗi của bạn là chọn bị bắt thay vì sửa. Tự kiểm tra tốn một buổi chiều và thay đổi cách mọi thứ khác được đọc.
- **you tried to steer the auditor towards the clean months** (severity 5): Choosing what the auditor sees is not cooperating with the audit. Even when it works, you have made yourself the thing being tested.
  - *VI:* Chọn điều kiểm toán viên được thấy không phải là hợp tác với kiểm toán. Kể cả khi thành công, bạn đã biến mình thành đối tượng bị kiểm tra.
- **you chose a booking date to get a better exchange gain** (severity 2): Policy exists so that two accountants would record the same thing. Choosing the date by the outcome removes the reason to have a policy.
  - *VI:* Chính sách tồn tại để hai kế toán ghi nhận cùng một điều. Chọn ngày theo kết quả làm mất lý do để có chính sách.
- **you wrote off a reconciling item you could not explain** (severity 2): An item you cannot explain is exactly the one an auditor will ask about. Writing it off hides the question instead of answering it.
  - *VI:* Khoản bạn không giải thích được chính là khoản kiểm toán sẽ hỏi. Xóa sổ chỉ giấu câu hỏi chứ không trả lời nó.
