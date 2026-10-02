# Review pack: Export Sales Specialist

AI first draft. Please read as someone who has done this job. For each scene mark: realistic? (is the
pressure believable), tone (grey, not cartoonish), Vietnamese natural (not a translation). Write notes
under each scene. Names and places are invented.

41 scenes. Facts created are listed under each outcome.

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

## sales.shipment_pull_in

*random; tags: buyer, delivery, pressure*

- **Boss:** The buyer on PO 4471 wants the shipment ten days earlier. They have a promotion locked in.
  - *VI* **Sếp:** Khách hàng đơn PO 4471 muốn giao sớm hơn mười ngày. Họ đã chốt chương trình khuyến mãi.
- **Production lead:** Line 3 is already full. Ten days means overtime and skipping the final packing check.
  - *VI* **Trưởng sản xuất:** Chuyền 3 đã kín lịch. Mười ngày nghĩa là tăng ca và bỏ bước kiểm tra đóng gói cuối.

**c1.** Commit to the buyer and push production to make it.  
*VI:* Cam kết với khách và ép sản xuất chạy cho kịp.

- (60%) Production squeezes the order in. The buyer is happy and your boss notices.
  - *VI:* Sản xuất chèn được đơn vào. Khách hài lòng và sếp để ý đến bạn.
  - effects: rep.boss +5, rep.production -3
- (40%, goes badly) Line 3 breaks down on Thursday. The shipment leaves late and the buyer complains to your boss.
  - *VI:* Chuyền 3 hỏng vào thứ Năm. Lô hàng đi trễ và khách phàn nàn với sếp của bạn.
  - effects: rep.boss -4, rep.buyer -4, stress +6

**c2.** Explain the real lead time and offer a split shipment.  
*VI:* Giải thích lead time thực tế và đề xuất giao hàng chia đợt.

- (70%) The buyer accepts half now and half on the original date. Production is relieved.
  - *VI:* Khách đồng ý nhận một nửa ngay và một nửa theo ngày ban đầu. Bên sản xuất thở phào.
  - effects: rep.buyer +3, rep.production +2
- (30%, goes badly) The buyer is unhappy and copies your boss on the reply. You will have to explain yourself.
  - *VI:* Khách không hài lòng và cc luôn sếp của bạn trong thư trả lời. Bạn sẽ phải giải trình.
  - effects: rep.boss -2, rep.buyer -3

**c3.** Tell the buyer yes and sort it out later.  
*VI:* Nói với khách là được, rồi tính sau.

- (50%) The buyer is thrilled. You have bought yourself a week, and a problem.
  - *VI:* Khách rất vui. Bạn câu được một tuần, kèm theo một vấn đề.
  - effects: stress -3, fact promised_unrealistic_date (private)
- (50%, goes badly) The buyer checks with the factory directly and finds out. Your credibility takes a hit.
  - *VI:* Khách hỏi thẳng nhà máy và phát hiện ra. Uy tín của bạn bị ảnh hưởng.
  - effects: rep.buyer -8, rep.boss -3, fact promised_unrealistic_date (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.rfq_discount

*random; tags: buyer, pricing, pressure*

- **Buyer:** Your new buyer's RFQ arrived with a note: they expect six percent off, or they go to another factory.
  - *VI* **Khách hàng:** RFQ của khách mới kèm ghi chú: họ muốn giảm sáu phần trăm, nếu không sẽ chuyển sang nhà máy khác.
- **Boss:** Your approval limit is three percent. Anything above needs the manager's signature.
  - *VI* **Sếp:** Hạn mức phê duyệt của bạn là ba phần trăm. Trên mức đó cần trưởng phòng ký.

**c1.** Offer three percent and trade it for a larger volume commitment.  
*VI:* Chào giảm ba phần trăm và đổi lấy cam kết sản lượng lớn hơn.

- (55%) The buyer takes three percent with a volume commitment. A clean deal within your limit.
  - *VI:* Khách chấp nhận ba phần trăm kèm cam kết sản lượng. Một thương vụ sạch, trong hạn mức của bạn.
  - effects: rep.boss +3, rep.buyer +2, arc discount_spiral: end
- (45%, goes badly) The buyer walks away for now. The quote goes cold.
  - *VI:* Khách tạm thời bỏ đi. Báo giá nguội dần.
  - effects: rep.boss -1, stress +3, arc discount_spiral: end

**c2.** Ask your manager to approve the discount, with the numbers ready.  
*VI:* Xin trưởng phòng duyệt mức giảm, kèm số liệu đã chuẩn bị sẵn.

- (60%) Your manager approves four and a half percent after reviewing the margin. The deal closes properly.
  - *VI:* Trưởng phòng duyệt bốn phẩy năm phần trăm sau khi xem biên lợi nhuận. Thương vụ chốt đúng quy trình.
  - effects: rep.boss +4, rep.buyer +2, arc discount_spiral: end
- (40%, goes badly) Your manager asks why you did not hold the line, and the discount is refused.
  - *VI:* Trưởng phòng hỏi sao bạn không giữ giá, và mức giảm bị từ chối.
  - effects: rep.boss -3, stress +4, arc discount_spiral: end

**c3.** Promise six percent now and get the approval afterwards.  
*VI:* Hứa sáu phần trăm ngay, xin duyệt sau.

- (60%) The buyer signs at once. Now you need the approval signed without anyone looking closely.
  - *VI:* Khách ký ngay. Giờ bạn cần được duyệt mà không ai soi kỹ.
  - effects: rep.buyer +5, stress +4, fact discount_above_limit (private), arc discount_spiral: expected
- (40%, goes badly) Finance spots a discount above your limit on the order. Your manager wants a word.
  - *VI:* Tài chính phát hiện mức giảm vượt hạn mức của bạn trên đơn hàng. Trưởng phòng muốn gặp bạn.
  - effects: rep.boss -6, stress +6, fact discount_above_limit (witnessed), arc discount_spiral: expected

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.forecast_meeting

*random; tags: forecast, integrity, pressure*

- **Boss:** Quarter-end forecast. Head office wants a number that looks strong.
  - *VI* **Sếp:** Dự báo cuối quý. Trụ sở muốn một con số trông thật mạnh.
- **Boss:** Round the pipeline up a little. Everyone does. It gets adjusted next cycle anyway.
  - *VI* **Sếp:** Làm tròn pipeline lên một chút. Ai cũng làm vậy. Kỳ sau vẫn điều chỉnh lại thôi.

**c1.** Give the forecast as you honestly see it, with the assumptions written down.  
*VI:* Đưa dự báo đúng như bạn thấy, ghi rõ các giả định.

- (70%) Your boss grumbles but accepts. The assumptions are on record if anyone asks.
  - *VI:* Sếp càu nhàu nhưng chấp nhận. Các giả định đã nằm trong hồ sơ nếu ai hỏi.
  - effects: rep.boss -2, fact forecast_honest (witnessed)
- (30%, goes badly) Your boss is openly annoyed and mentions your KPI review.
  - *VI:* Sếp tỏ ra khó chịu ra mặt và nhắc đến đợt đánh giá KPI của bạn.
  - effects: rep.boss -6, stress +5

**c2.** Pad the forecast as asked.  
*VI:* Làm tròn dự báo lên như được yêu cầu.

- (100%) The number goes up, and so does your boss's mood. A bonus of three million dong lands with the month's pay.
  - *VI:* Con số tăng lên, tâm trạng của sếp cũng vậy. Khoản thưởng ba triệu đồng vào cùng kỳ lương.
  - effects: cash_vnd +3000000, rep.boss +8, fact forecast_padded (private)

**c3.** Ask for a day to check the pipeline properly.  
*VI:* Xin một ngày để kiểm tra pipeline cho kỹ.

- (50%) You get the day. The revised number is lower than hoped but defensible.
  - *VI:* Bạn được thêm một ngày. Con số điều chỉnh thấp hơn mong đợi nhưng bảo vệ được.
  - effects: rep.boss -1
- (50%, goes badly) Your boss says there is no time, and puts a number in for you.
  - *VI:* Sếp nói không kịp nữa, và tự điền một con số thay bạn.
  - effects: rep.boss -3, stress +2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.payment_overdue

*random; tags: finance, buyer, pressure*

- **Finance lead:** Invoice 2208 for your German buyer is 45 days overdue. It hurts our DSO, and Finance wants you to chase it today.
  - *VI* **Trưởng tài chính:** Hóa đơn 2208 của khách Đức đã quá hạn 45 ngày. Việc này ảnh hưởng chỉ số DSO, và Tài chính muốn bạn đòi ngay hôm nay.
- **Buyer:** Accounts payable says the next payment run is in three weeks. Send us a statement first.
  - *VI* **Khách hàng:** Bên kế toán phải trả nói kỳ thanh toán tới là ba tuần nữa. Hãy gửi bảng đối chiếu công nợ trước.

**c1.** Send a clear statement and call their AP manager directly.  
*VI:* Gửi bảng đối chiếu rõ ràng và gọi thẳng cho trưởng bộ phận kế toán phải trả của họ.

- (65%) The AP manager moves the invoice into the next run. Finance notices you closed it.
  - *VI:* Trưởng kế toán phải trả đưa hóa đơn vào kỳ thanh toán tới. Tài chính ghi nhận bạn đã xử lý xong.
  - effects: rep.finance +4, rep.buyer +1, arc overdue_account: end
- (35%, goes badly) The call goes to voicemail twice. The invoice stays open and Finance asks again.
  - *VI:* Cuộc gọi vào hộp thư thoại hai lần. Hóa đơn vẫn mở và Tài chính lại hỏi.
  - effects: rep.finance -2, stress +3, arc overdue_account: end

**c2.** Offer a two percent early-payment discount to get the cash this week.  
*VI:* Đề nghị chiết khấu hai phần trăm nếu thanh toán sớm để có tiền ngay trong tuần.

- (60%) The buyer pays within days. The discount comes out of your margin, and Finance is pleased.
  - *VI:* Khách thanh toán trong vài ngày. Khoản chiết khấu lấy từ biên lợi nhuận của bạn, và Tài chính hài lòng.
  - effects: rep.finance +5, rep.boss -1, arc overdue_account: end
- (40%, goes badly) The buyer takes the discount but pays late anyway. You lost margin for nothing.
  - *VI:* Khách nhận chiết khấu nhưng vẫn trả trễ. Bạn mất biên lợi nhuận một cách vô ích.
  - effects: rep.finance -1, rep.boss -3, stress +3, arc overdue_account: end

**c3.** Tell production to hold the buyer's next order until they pay.  
*VI:* Bảo bên sản xuất giữ đơn kế tiếp của khách cho đến khi họ thanh toán.

- (50%) The buyer suddenly finds the money. The relationship is strained, though.
  - *VI:* Khách bỗng tìm ra tiền. Nhưng mối quan hệ trở nên căng thẳng.
  - effects: rep.finance +4, rep.buyer -5, rep.production -1, arc overdue_account: pull_in
- (50%, goes badly) The buyer escalates to your boss, who did not know about the hold.
  - *VI:* Khách khiếu nại lên sếp của bạn, người không hề biết về việc giữ đơn.
  - effects: rep.boss -5, rep.buyer -6, stress +4, arc overdue_account: pull_in

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.sample_request

*random; tags: buyer, samples*

- **Buyer:** A promising prospect in Poland wants free samples of the new ceramic pan, and they want them this week.
  - *VI* **Khách hàng:** Một khách tiềm năng ở Ba Lan muốn nhận mẫu miễn phí của dòng chảo ceramic mới, và cần ngay trong tuần này.
- **QC lead:** The sample budget is spent for the month. The reserve stock is for buyer claims only.
  - *VI* **Trưởng QC:** Ngân sách mẫu tháng này đã hết. Hàng dự trữ chỉ dành cho khiếu nại của khách.

**c1.** Follow the procedure: request budget approval and ship in two weeks.  
*VI:* Làm đúng quy trình: xin duyệt ngân sách và gửi mẫu sau hai tuần.

- (70%) The prospect accepts the delay and appreciates the professionalism.
  - *VI:* Khách tiềm năng chấp nhận chờ và đánh giá cao sự chuyên nghiệp.
  - effects: rep.boss +2, rep.buyer +1
- (30%, goes badly) The prospect goes cold while waiting. A competitor sends samples first.
  - *VI:* Khách nguội đi trong lúc chờ. Đối thủ gửi mẫu trước.
  - effects: rep.boss -1, stress +2

**c2.** Take samples from the claims reserve and sort out the paperwork later.  
*VI:* Lấy mẫu từ kho dự trữ khiếu nại và bổ sung giấy tờ sau.

- (60%) The samples ship today. QC has not noticed yet.
  - *VI:* Mẫu được gửi ngay hôm nay. Phòng QC chưa phát hiện.
  - effects: rep.buyer +4, stress -2, fact reserve_stock_taken (private)
- (40%, goes badly) QC counts the reserve and finds the gap. They want to know who signed it out.
  - *VI:* QC kiểm kho dự trữ và thấy thiếu. Họ muốn biết ai đã xuất.
  - effects: rep.qc -8, rep.boss -3, fact reserve_stock_taken (witnessed)

**c3.** Pay the courier yourself and send your own display samples.  
*VI:* Tự trả tiền chuyển phát và gửi mẫu trưng bày của chính bạn.

- (100%) The prospect gets a pair of samples in three days. It costs you a little, and nobody has to bend a rule.
  - *VI:* Khách nhận được mẫu sau ba ngày. Bạn tốn một khoản nhỏ, và không ai phải lách quy định.
  - effects: cash_vnd -800000, rep.buyer +3, rep.boss +1

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.quality_complaint

*random; tags: quality, buyer, pressure*

- **Buyer:** Your buyer reports the non-stick coating peeling on about three percent of last month's lot, and asks for a credit note.
  - *VI* **Khách hàng:** Khách báo lớp chống dính bong tróc ở khoảng ba phần trăm lô hàng tháng trước, và yêu cầu ghi có.
- **QC lead:** Our inspection passed that lot. Three percent is inside the agreed tolerance.
  - *VI* **Trưởng QC:** Đợt kiểm tra của chúng tôi đã đạt cho lô đó. Ba phần trăm nằm trong dung sai đã thỏa thuận.

**c1.** Open a formal complaint and ask QC to test retained samples with the buyer.  
*VI:* Mở khiếu nại chính thức và nhờ QC cùng khách kiểm tra mẫu lưu.

- (60%) The tests confirm a batch problem on one line. The buyer sees you dealing with it honestly, and QC fixes the process.
  - *VI:* Kết quả xác nhận một chuyền có lỗi lô hàng. Khách thấy bạn xử lý trung thực, và QC chỉnh lại quy trình.
  - effects: rep.qc +4, rep.buyer +5, company.audit_readiness +3
- (40%, goes badly) The retained samples are inconclusive. It takes weeks, and the buyer is impatient.
  - *VI:* Mẫu lưu không cho kết luận rõ ràng. Mất nhiều tuần và khách mất kiên nhẫn.
  - effects: rep.buyer -2, stress +4

**c2.** Agree a three percent credit note on your own to close it fast.  
*VI:* Tự đồng ý ghi có ba phần trăm để đóng vụ việc nhanh.

- (55%) The buyer accepts and the complaint closes. The credit note is above your approval limit, though.
  - *VI:* Khách chấp nhận và khiếu nại được đóng. Nhưng khoản ghi có vượt hạn mức phê duyệt của bạn.
  - effects: rep.buyer +4, stress -2, fact credit_above_limit (private)
- (45%, goes badly) Finance spots a credit note above your limit and asks who approved it.
  - *VI:* Tài chính phát hiện khoản ghi có vượt hạn mức của bạn và hỏi ai đã duyệt.
  - effects: rep.finance -5, rep.boss -4, fact credit_above_limit (witnessed)

**c3.** Reply that the damage must have happened in shipping.  
*VI:* Trả lời rằng hư hỏng chắc chắn xảy ra trong lúc vận chuyển.

- (50%) The buyer backs off for now. The forwarder's insurer starts asking questions instead.
  - *VI:* Khách tạm lùi bước. Thay vào đó, bên bảo hiểm của đơn vị giao nhận bắt đầu đặt câu hỏi.
  - effects: rep.buyer -1, stress +2, fact blamed_forwarder (private)
- (50%, goes badly) The buyer sends photos taken at unloading. The coating is clearly the problem, and you look evasive.
  - *VI:* Khách gửi ảnh chụp lúc dỡ hàng. Rõ ràng lớp phủ là vấn đề, và bạn trông như đang né tránh.
  - effects: rep.buyer -7, rep.boss -3, fact blamed_forwarder (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.tet_rush

*random; tags: seasonal, delivery, pressure*

- **Production lead:** The plant closes for Tet in two weeks. Every buyer wants their order out before the shutdown.
  - *VI* **Trưởng sản xuất:** Nhà máy nghỉ Tết sau hai tuần nữa. Khách nào cũng muốn hàng xuất trước kỳ nghỉ.
- **Boss:** Three of your orders are still unfinished. Which ones ship first is your call.
  - *VI* **Sếp:** Ba đơn của bạn vẫn chưa xong. Đơn nào đi trước là do bạn quyết.

**c1.** Rank the orders by contract penalty and ship the most exposed ones first.  
*VI:* Xếp hạng các đơn theo mức phạt hợp đồng và xuất đơn rủi ro nhất trước.

- (75%) You avoid the two penalties that mattered. The third buyer grumbles but accepts a January date.
  - *VI:* Bạn tránh được hai khoản phạt quan trọng. Khách thứ ba càu nhàu nhưng chấp nhận ngày giao trong tháng Giêng.
  - effects: rep.boss +4, rep.buyer -1, rep.production +2
- (25%, goes badly) A penalty clause you overlooked is triggered. It is small, but your boss remembers.
  - *VI:* Một điều khoản phạt bạn bỏ sót bị kích hoạt. Khoản nhỏ thôi, nhưng sếp nhớ.
  - effects: rep.boss -3, stress +3

**c2.** Ask for weekend shifts so all three ship before Tet.  
*VI:* Xin tăng ca cuối tuần để cả ba đơn kịp xuất trước Tết.

- (50%) The weekend shifts work. Production is tired and lets you know it.
  - *VI:* Tăng ca cuối tuần có hiệu quả. Bên sản xuất mệt và cho bạn biết điều đó.
  - effects: rep.boss +5, rep.production -5, rep.buyer +3
- (50%, goes badly) A machine fails on the second weekend. Two orders ship, and one misses the vessel.
  - *VI:* Một máy hỏng vào cuối tuần thứ hai. Hai đơn xuất được, một đơn lỡ tàu.
  - effects: rep.boss -3, rep.production -6, rep.buyer -5, stress +6

**c3.** Promise all three buyers a date before the break and work it out afterwards.  
*VI:* Hứa với cả ba khách một ngày giao trước kỳ nghỉ và tính sau.

- (40%) Everyone is happy today, and you have a very tense last week of the year.
  - *VI:* Hôm nay ai cũng vui, và bạn có một tuần cuối năm cực kỳ căng thẳng.
  - effects: stress +5, rep.buyer +2, fact promised_unrealistic_date (private)
- (60%, goes badly) Only two orders make it. The third buyer heard your promise and remembers.
  - *VI:* Chỉ hai đơn kịp. Khách thứ ba nghe lời hứa của bạn và nhớ rõ.
  - effects: rep.buyer -8, rep.boss -3, stress +5, fact promised_unrealistic_date (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.buyer_gift

*random; tags: integrity, buyer, dark*

- **Buyer:** Between us, a smaller order split across two invoices keeps my approvals simple. There would be a coordination fee for you.
  - *VI* **Khách hàng:** Nói riêng với nhau, tách đơn nhỏ thành hai hóa đơn giúp tôi duyệt dễ hơn. Sẽ có phí phối hợp dành cho bạn.
- **Buyer:** Five million dong. Nothing on paper, nobody harmed. Everyone in this business does it.
  - *VI* **Khách hàng:** Năm triệu đồng. Không giấy tờ, không ai thiệt. Trong nghề này ai cũng làm vậy.

**c1.** Decline politely and note the conversation in your own records.  
*VI:* Từ chối lịch sự và ghi lại cuộc trao đổi trong sổ của bạn.

- (80%) The buyer shrugs and moves on, slightly cooler. Your notes are there if anyone ever asks.
  - *VI:* Đối tác nhún vai rồi bỏ qua, thái độ hơi lạnh hơn. Ghi chép của bạn vẫn còn nếu ai hỏi tới.
  - effects: rep.buyer -2, fact declined_kickback (private)
- (20%, goes badly) The buyer takes it badly and stops sharing forecasts with you for a while.
  - *VI:* Đối tác phật ý và một thời gian không chia sẻ dự báo với bạn nữa.
  - effects: rep.buyer -6, stress +2

**c2.** Accept the fee and split the order.  
*VI:* Nhận khoản phí và tách đơn hàng.

- (70%) The money arrives in cash. The split orders go through without a problem.
  - *VI:* Tiền được đưa bằng tiền mặt. Các đơn tách đi qua mà không có vấn đề gì.
  - effects: cash_vnd +5000000, rep.buyer +4, fact accepted_kickback (private)
- (30%, goes badly) Finance notices two invoices for one shipment. Questions start immediately.
  - *VI:* Tài chính thấy hai hóa đơn cho một lô hàng. Các câu hỏi bắt đầu ngay lập tức.
  - effects: rep.finance -6, rep.boss -6, stress +8, fact accepted_kickback (witnessed)

**c3.** Tell your boss and the compliance officer about the offer.  
*VI:* Báo với sếp và cán bộ tuân thủ về lời đề nghị.

- (70%) Your boss thanks you. The buyer's purchasing rep is moved to another account, and the relationship resets.
  - *VI:* Sếp cảm ơn bạn. Nhân viên mua hàng của khách được chuyển sang mảng khác, và mối quan hệ phải bắt đầu lại.
  - effects: rep.boss +6, rep.buyer -4, fact reported_kickback (witnessed)
- (30%, goes badly) Your boss shrugs it off as ordinary business and asks you not to make waves.
  - *VI:* Sếp coi đó là chuyện bình thường trong kinh doanh và bảo bạn đừng làm to chuyện.
  - effects: rep.boss -2, stress +3, fact reported_kickback (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.backdate_invoice

*random; tags: integrity, quarter_end, dark*

- **Boss:** We are two hundred thousand dollars short of the quarter target. The last shipment leaves on the first, but I need it booked before quarter-end.
  - *VI* **Sếp:** Chúng ta thiếu hai trăm nghìn đô so với chỉ tiêu quý. Lô cuối xuất vào ngày mùng một, nhưng tôi cần ghi nhận trước cuối quý.
- **Boss:** Date the documents the thirtieth. It is only a few days. Nobody checks.
  - *VI* **Sếp:** Ghi ngày chứng từ là ngày ba mươi. Chỉ chênh vài ngày thôi. Không ai kiểm tra đâu.

**c1.** Refuse, and explain the revenue recognition problem.  
*VI:* Từ chối và giải thích vấn đề ghi nhận doanh thu.

- (60%) Your boss is irritated but accepts it. The numbers stay clean.
  - *VI:* Sếp bực nhưng chấp nhận. Số liệu vẫn sạch.
  - effects: rep.boss -3, stress +3, fact refused_backdating (witnessed)
- (40%, goes badly) Your boss takes it personally and brings up your review.
  - *VI:* Sếp coi đó là chuyện cá nhân và nhắc đến kỳ đánh giá của bạn.
  - effects: rep.boss -7, stress +5, fact refused_backdating (witnessed)

**c2.** Propose shipping a partial order before the thirtieth instead.  
*VI:* Đề xuất giao một phần đơn hàng trước ngày ba mươi.

- (60%) The buyer accepts a partial shipment. It closes most of the gap, honestly.
  - *VI:* Khách chấp nhận giao một phần. Nó bù được phần lớn khoảng thiếu, một cách trung thực.
  - effects: rep.boss +3, rep.buyer +1
- (40%, goes badly) The buyer refuses the split. You still miss the target, and your boss knows you tried.
  - *VI:* Khách từ chối giao chia đợt. Bạn vẫn hụt chỉ tiêu, và sếp biết bạn đã cố gắng.
  - effects: rep.boss -2, stress +3

**c3.** Do it quietly and date the documents the thirtieth.  
*VI:* Lặng lẽ làm và ghi ngày chứng từ là ngày ba mươi.

- (70%) The quarter closes on target. You have signed something you would rather not explain.
  - *VI:* Quý đóng đúng chỉ tiêu. Bạn đã ký một thứ mà bạn không muốn phải giải thích.
  - effects: cash_vnd +2000000, rep.boss +8, fact backdated_documents (private)
- (30%, goes badly) The auditors match the vessel date with the invoice date. The gap is impossible to explain.
  - *VI:* Kiểm toán đối chiếu ngày tàu chạy với ngày hóa đơn. Khoảng chênh không thể giải thích.
  - effects: rep.finance -8, rep.boss -6, stress +9, fact backdated_documents (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.competitor_quote

*random; tags: pricing, competition, pressure*

- **Buyer:** A factory in Indonesia quoted us eight percent below you on the same pan. Can you match it?
  - *VI* **Khách hàng:** Một nhà máy ở Indonesia báo giá thấp hơn bạn tám phần trăm cho cùng loại chảo. Bạn có thể bằng giá không?
- **Boss:** Our margin cannot take eight percent. Find a way to keep the account.
  - *VI* **Sếp:** Biên lợi nhuận của chúng ta không chịu nổi tám phần trăm. Hãy tìm cách giữ khách.

**c1.** Hold the price and sell on lead time, quality and after-sales service.  
*VI:* Giữ giá và thuyết phục bằng thời gian giao, chất lượng và dịch vụ hậu mãi.

- (55%) The buyer stays, with a smaller order. Quality wins more than price this time.
  - *VI:* Khách ở lại, với đơn nhỏ hơn. Lần này chất lượng thắng giá.
  - effects: rep.boss +3, rep.buyer +2
- (45%, goes badly) The buyer splits the order with the competitor. You keep half the volume.
  - *VI:* Khách chia đơn với đối thủ. Bạn giữ được một nửa sản lượng.
  - effects: rep.boss -3, rep.buyer -2, stress +3

**c2.** Match the price and ask your manager to sign off on the margin.  
*VI:* Bằng giá và nhờ trưởng phòng duyệt biên lợi nhuận.

- (60%) Your manager approves a partial match. You keep the account at a thinner margin.
  - *VI:* Trưởng phòng duyệt bằng giá một phần. Bạn giữ khách với biên lợi nhuận mỏng hơn.
  - effects: rep.boss +1, rep.buyer +3
- (40%, goes badly) Your manager refuses and asks why you offered it before asking.
  - *VI:* Trưởng phòng từ chối và hỏi sao bạn đề nghị trước khi xin ý kiến.
  - effects: rep.boss -4, stress +3

**c3.** Promise a special coating spec at the same price, and let production figure it out.  
*VI:* Hứa lớp phủ đặc biệt với cùng mức giá, để bên sản xuất tự tính.

- (40%) The buyer is delighted. Production is not.
  - *VI:* Khách rất hài lòng. Bên sản xuất thì không.
  - effects: rep.buyer +5, rep.production -4, stress +3
- (60%, goes badly) Production says the spec is not possible at that cost. You have to walk it back.
  - *VI:* Bên sản xuất nói không thể làm quy cách đó với chi phí này. Bạn phải rút lại lời hứa.
  - effects: rep.buyer -6, rep.production -3, rep.boss -3, stress +4

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.overtime_request

*random; tags: workload, colleagues*

- **CS colleague:** I am out sick tomorrow and the customer service line is unmanned. Could you cover my calls? Just the urgent ones.
  - *VI* **Đồng nghiệp CSKH:** Ngày mai tôi nghỉ ốm mà đường dây chăm sóc khách hàng chưa có người trực. Bạn nhận giúp cuộc gọi được không? Chỉ những cuộc gấp thôi.
- **CS colleague:** I know it is not your job.
  - *VI* **Đồng nghiệp CSKH:** Tôi biết đó không phải việc của bạn.

**c1.** Say yes and cover the urgent calls.  
*VI:* Đồng ý và nhận các cuộc gọi gấp.

- (100%) You get through the day tired. The customer service team will remember it, and so will your inbox.
  - *VI:* Bạn qua được ngày hôm đó trong mệt mỏi. Nhóm chăm sóc khách hàng sẽ nhớ điều này, hộp thư của bạn cũng vậy.
  - effects: rep.cs +8, stress +4

**c2.** Decline politely and suggest who else might cover.  
*VI:* Từ chối lịch sự và gợi ý người khác có thể thay.

- (80%) They find someone else. Nothing changes, and nothing is lost.
  - *VI:* Họ tìm được người khác. Không có gì thay đổi, cũng không mất gì.
  - effects: rep.cs -1, stress -1
- (20%, goes badly) Nobody covers, and a buyer waits a day for an answer.
  - *VI:* Không ai trực, và một khách phải chờ một ngày để có câu trả lời.
  - effects: rep.cs -4, rep.buyer -2

**c3.** Ask your boss to arrange cover, so you do not have to.  
*VI:* Nhờ sếp sắp xếp người trực, để bạn khỏi phải làm.

- (60%) Your boss assigns someone. You look organized, and the colleague looks a little embarrassed.
  - *VI:* Sếp phân công người khác. Bạn trông có tổ chức, còn đồng nghiệp hơi ngượng.
  - effects: rep.boss +1, rep.cs -2
- (40%, goes badly) Your boss asks why you are sending him problems instead of solving them.
  - *VI:* Sếp hỏi sao bạn đưa vấn đề cho sếp thay vì tự giải quyết.
  - effects: rep.boss -3, stress +2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.customs_docs

*random; tags: logistics, compliance, dark*

- **Forwarder:** The vessel cuts off tomorrow at noon. The certificate of origin lists the wrong factory address.
  - *VI* **Bên giao nhận:** Tàu cắt máng vào trưa mai. Giấy chứng nhận xuất xứ ghi sai địa chỉ nhà máy.
- **Forwarder:** If the port checks, the container can be held for weeks. Tell me what you want to do.
  - *VI* **Bên giao nhận:** Nếu cảng kiểm tra, container có thể bị giữ nhiều tuần. Cho tôi biết bạn muốn làm gì.

**c1.** Stop the booking and get the certificate reissued properly.  
*VI:* Dừng booking và làm cấp lại giấy chứng nhận đúng quy trình.

- (70%) The chamber reissues it in time for the next vessel. A week late, and clean.
  - *VI:* Cơ quan cấp lại kịp cho chuyến tàu sau. Trễ một tuần, nhưng sạch sẽ.
  - effects: rep.buyer -2, rep.boss +1, company.audit_readiness +2
- (30%, goes badly) Reissuing takes ten days. The buyer is angry about the delay.
  - *VI:* Cấp lại mất mười ngày. Khách tức giận vì bị trễ.
  - effects: rep.buyer -6, rep.boss -2, stress +4

**c2.** Ship on time and correct the certificate afterwards.  
*VI:* Giao đúng hạn và sửa giấy chứng nhận sau.

- (60%) Nobody checks. The shipment arrives on time, with a certificate you know is wrong.
  - *VI:* Không ai kiểm tra. Lô hàng đến đúng hạn, với một giấy chứng nhận mà bạn biết là sai.
  - effects: stress +2, rep.buyer +1, fact shipped_wrong_certificate (private)
- (40%, goes badly) The importing port flags the mismatch. The container is held and a fine follows.
  - *VI:* Cảng nhập khẩu phát hiện sai lệch. Container bị giữ và bị phạt.
  - effects: rep.buyer -8, rep.boss -5, rep.finance -3, stress +7, fact shipped_wrong_certificate (witnessed)

**c3.** Ask the forwarder to arrange a corrected certificate for a small fee.  
*VI:* Nhờ bên giao nhận lo một giấy chứng nhận đã chỉnh sửa với một khoản phí nhỏ.

- (50%) A corrected certificate appears by morning. You do not ask how.
  - *VI:* Sáng hôm sau có giấy chứng nhận đã sửa. Bạn không hỏi làm bằng cách nào.
  - effects: rep.buyer +1, fact paid_for_document (private)
- (50%, goes badly) The corrected certificate turns out to be a poor forgery. Customs notices.
  - *VI:* Giấy chứng nhận sửa hóa ra là hàng giả vụng về. Hải quan phát hiện.
  - effects: rep.boss -8, rep.buyer -5, stress +8, fact paid_for_document (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.kpi_review

*random; tags: review, boss, pressure*

- **Boss:** Monthly review. You are at seventy percent of quota, and the quarter is half gone.
  - *VI* **Sếp:** Họp đánh giá tháng. Bạn đang ở bảy mươi phần trăm chỉ tiêu, và quý đã trôi qua một nửa.
- **Boss:** What is your plan to close the gap?
  - *VI* **Sếp:** Kế hoạch của bạn để bù phần thiếu là gì?

**c1.** Show your pipeline with realistic close dates and name the risks.  
*VI:* Trình bày pipeline với ngày chốt thực tế và nêu rõ các rủi ro.

- (65%) Your boss respects the honesty and helps you remove two blockers.
  - *VI:* Sếp tôn trọng sự trung thực và giúp bạn gỡ hai điểm nghẽn.
  - effects: rep.boss +4, stress -2
- (35%, goes badly) The pipeline looks thin. Your boss is polite, but the pressure is clear.
  - *VI:* Pipeline trông mỏng. Sếp lịch sự, nhưng áp lực thì rõ ràng.
  - effects: rep.boss -2, stress +4

**c2.** Promise to catch up and chase every possible order, even the low-margin ones.  
*VI:* Hứa sẽ bắt kịp và chạy mọi đơn có thể, kể cả đơn biên lợi nhuận thấp.

- (50%) You land two extra orders. The volume helps the quota, though the margin hurts.
  - *VI:* Bạn chốt thêm hai đơn. Sản lượng giúp đạt chỉ tiêu, dù biên lợi nhuận bị ảnh hưởng.
  - effects: rep.boss +5, stress +5
- (50%, goes badly) The chase costs you a month and produces little.
  - *VI:* Cuộc chạy đơn tốn của bạn một tháng mà chẳng được bao nhiêu.
  - effects: rep.boss -3, stress +7

**c3.** Point out that production delays cost you sales.  
*VI:* Chỉ ra rằng việc sản xuất trễ làm bạn mất đơn.

- (35%) Your boss agrees some of it was not your fault, and takes it upstairs.
  - *VI:* Sếp đồng ý một phần không phải lỗi của bạn và đưa lên cấp trên.
  - effects: rep.boss +1, rep.production -3
- (65%, goes badly) Production hears about it before the day is over. Nobody feels supported.
  - *VI:* Bên sản xuất nghe chuyện trước khi hết ngày. Không ai cảm thấy được ủng hộ.
  - effects: rep.boss -3, rep.production -6, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.fx_price

*random; tags: finance, pricing, dark*

- **Finance lead:** The dong fell against the dollar this quarter, and our steel costs are in dollars. Your fixed-price contracts just lost margin.
  - *VI* **Trưởng tài chính:** Đồng giảm giá so với đô trong quý này, mà chi phí thép của chúng ta tính bằng đô. Các hợp đồng giá cố định của bạn vừa mất biên lợi nhuận.
- **Finance lead:** Tell me how you want to deal with it.
  - *VI* **Trưởng tài chính:** Hãy cho tôi biết bạn định xử lý thế nào.

**c1.** Renegotiate with a currency clause at the next renewal.  
*VI:* Đàm phán lại với điều khoản tỷ giá ở lần gia hạn tới.

- (60%) The buyer accepts a clause for new orders. Finance is relieved.
  - *VI:* Khách chấp nhận điều khoản cho các đơn mới. Tài chính nhẹ nhõm.
  - effects: rep.finance +4, rep.buyer -1
- (40%, goes badly) The buyer refuses to touch the contract. You are exposed for the rest of the year.
  - *VI:* Khách không chịu đụng đến hợp đồng. Bạn phải chịu rủi ro suốt phần còn lại của năm.
  - effects: rep.finance -1, stress +3

**c2.** Absorb the loss and keep the buyers calm.  
*VI:* Chấp nhận lỗ và giữ khách yên tâm.

- (100%) Nobody outside the company notices. Your margin report does.
  - *VI:* Không ai bên ngoài công ty để ý. Báo cáo biên lợi nhuận của bạn thì có.
  - effects: rep.buyer +2, rep.finance -2, rep.boss -1

**c3.** Ask production to switch to a cheaper coating supplier without telling the buyer.  
*VI:* Nhờ bên sản xuất đổi sang nhà cung cấp lớp phủ rẻ hơn mà không báo khách.

- (50%) Costs drop and the buyer notices nothing, yet.
  - *VI:* Chi phí giảm và khách chưa nhận ra gì, tạm thời.
  - effects: rep.finance +4, rep.qc -4, fact silent_spec_change (private)
- (50%, goes badly) The buyer's lab finds the coating change in the next batch test.
  - *VI:* Phòng thí nghiệm của khách phát hiện lớp phủ đã thay đổi trong đợt kiểm tra lô kế tiếp.
  - effects: rep.buyer -10, rep.boss -5, rep.qc -3, stress +8, fact silent_spec_change (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.new_hire_mentor

*random; tags: colleagues*

- **New hire:** Boss asked me to shadow you this week. I have no idea how quoting works here. Could you show me?
  - *VI* **Nhân viên mới:** Sếp bảo tôi đi theo bạn tuần này. Tôi chưa biết báo giá ở đây làm thế nào. Bạn chỉ tôi được không?
- **New hire:** I will try not to slow you down.
  - *VI* **Nhân viên mới:** Tôi sẽ cố không làm chậm việc của bạn.

**c1.** Set aside proper time and walk them through a real quote.  
*VI:* Dành thời gian đàng hoàng và hướng dẫn họ làm một báo giá thật.

- (90%) They learn fast, and your boss hears good things.
  - *VI:* Họ học nhanh, và sếp nghe được nhiều lời tốt.
  - effects: rep.boss +4, rep.cs +1, stress +2, arc quynh: copies
- (10%, goes badly) They make a mistake on a live quote, and you spend the evening fixing it.
  - *VI:* Họ mắc lỗi trên một báo giá thật, và bạn mất cả buổi tối để sửa.
  - effects: rep.boss -1, stress +4, arc quynh: copies

**c2.** Show them the shortcuts, including the ones that bend the rules.  
*VI:* Chỉ họ các đường tắt, kể cả những cách lách quy định.

- (60%) They are delighted. Corners are now being cut in two heads instead of one.
  - *VI:* Họ rất vui. Giờ có hai người cùng lách quy định thay vì một.
  - effects: rep.boss +1, fact taught_shortcuts (private), arc quynh: copies
- (40%, goes badly) The shortcuts show up in their first quote, and your name is on the training.
  - *VI:* Các đường tắt xuất hiện ngay trong báo giá đầu tiên của họ, và tên bạn nằm trong buổi hướng dẫn.
  - effects: rep.boss -5, stress +3, fact taught_shortcuts (witnessed), arc quynh: copies

**c3.** Say you are too busy and point them to the manual.  
*VI:* Nói rằng bạn quá bận và chỉ họ đến sổ tay.

- (100%) They find their own way, slowly. Nobody blames you.
  - *VI:* Họ tự mò đường, chậm hơn. Không ai trách bạn.
  - effects: rep.boss -1, stress -1, arc quynh: copies

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.trade_fair

*random; tags: marketing, buyer*

- **Boss:** There is a housewares fair in Frankfurt in a few weeks. The budget covers one person, and I am open to a case for it.
  - *VI* **Sếp:** Vài tuần nữa có hội chợ đồ gia dụng ở Frankfurt. Ngân sách chỉ đủ cho một người, và tôi sẵn sàng nghe lý do.
- **Boss:** Convince me it is worth the money.
  - *VI* **Sếp:** Hãy thuyết phục tôi là đáng đồng tiền.

**c1.** Prepare a short case with the accounts you could meet and the revenue at stake.  
*VI:* Chuẩn bị một bản trình bày ngắn với các khách có thể gặp và doanh thu liên quan.

- (60%) Your boss approves the trip. Three meetings are already booked.
  - *VI:* Sếp duyệt chuyến đi. Ba cuộc hẹn đã được đặt sẵn.
  - effects: rep.boss +5, arc trade_fair_lead: sample
- (40%, goes badly) The numbers look optimistic to your boss, and the trip goes to a colleague.
  - *VI:* Sếp thấy số liệu quá lạc quan, và chuyến đi thuộc về một đồng nghiệp.
  - effects: rep.boss -1, stress +2, arc trade_fair_lead: sample

**c2.** Argue that the buyers expect to see you there.  
*VI:* Lập luận rằng khách hàng mong được gặp bạn ở đó.

- (40%) It sounds reasonable enough. Your boss approves half the budget.
  - *VI:* Nghe cũng hợp lý. Sếp duyệt một nửa ngân sách.
  - effects: rep.boss +2, arc trade_fair_lead: sample
- (60%, goes badly) Your boss says every salesperson says that.
  - *VI:* Sếp nói nhân viên kinh doanh nào cũng nói vậy.
  - effects: rep.boss -2, arc trade_fair_lead: sample

**c3.** Skip it and keep your desk work moving.  
*VI:* Bỏ qua và tập trung việc trên bàn.

- (100%) The fair goes ahead without you. Your pipeline gets your full attention.
  - *VI:* Hội chợ diễn ra không có bạn. Pipeline của bạn nhận được toàn bộ sự chú ý.
  - effects: stress -2, arc trade_fair_lead: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.finance_inquiry

*random; tags: consequence, finance, integrity*

- **Finance lead:** A number in your file does not match the paperwork. Finance would like a word.
  - *VI* **Trưởng tài chính:** Có một con số trong hồ sơ của bạn không khớp với chứng từ. Tài chính muốn gặp bạn.
- **Finance lead:** Walk me through it. I would rather hear it from you than find it myself.
  - *VI* **Trưởng tài chính:** Bạn giải thích giúp tôi. Tôi thà nghe từ bạn còn hơn tự đi tìm ra.

**c1.** Own up and offer to correct the paperwork.  
*VI:* Thẳng thắn nhận và đề nghị sửa lại chứng từ.

- (80%) Finance appreciates it. There is a mark on your file, but a small one.
  - *VI:* Tài chính đánh giá cao điều đó. Hồ sơ của bạn có một dấu, nhưng nhỏ thôi.
  - effects: rep.finance +4, stress +2, fact came_clean (witnessed)
- (20%, goes badly) Finance accepts the correction but writes it up anyway.
  - *VI:* Tài chính chấp nhận việc sửa nhưng vẫn lập biên bản.
  - effects: rep.finance -2, rep.boss -2, fact came_clean (witnessed)

**c2.** Explain it away as a timing difference.  
*VI:* Giải thích rằng đó chỉ là chênh lệch thời điểm.

- (45%) Finance accepts it, for now. You would rather not be asked twice.
  - *VI:* Tài chính tạm chấp nhận. Bạn không muốn bị hỏi lần hai.
  - effects: stress -1
- (55%, goes badly) The dates do not support your explanation. Finance notes that too.
  - *VI:* Các ngày tháng không khớp với lời giải thích của bạn. Tài chính cũng ghi nhận điều đó.
  - effects: rep.finance -8, stress +5, fact lied_to_finance (witnessed)

**c3.** Say your boss asked you to do it.  
*VI:* Nói rằng sếp bảo bạn làm vậy.

- (30%) Finance turns to your boss with new questions. Your boss will hear about this.
  - *VI:* Tài chính quay sang hỏi sếp của bạn. Sếp sẽ biết chuyện này.
  - effects: rep.boss -6, rep.finance +1
- (70%, goes badly) Your boss denies it, in front of Finance. You are on your own now.
  - *VI:* Sếp phủ nhận ngay trước mặt Tài chính. Giờ bạn phải tự lo.
  - effects: rep.boss -10, rep.finance -6, stress +8, fact lied_to_finance (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.buyer_confronts

*random; tags: consequence, buyer*

- **Buyer:** I have been hearing things from your factory floor. I would like a straight answer from you.
  - *VI* **Khách hàng:** Tôi nghe được vài chuyện từ xưởng của bạn. Tôi muốn một câu trả lời thẳng thắn.
- **Buyer:** Trust is most of what I buy from you. Do not waste it.
  - *VI* **Khách hàng:** Niềm tin là phần lớn thứ tôi mua từ bạn. Đừng phí nó.

**c1.** Tell them what happened, and what you will do about it.  
*VI:* Nói cho họ biết chuyện gì đã xảy ra và bạn sẽ làm gì.

- (70%) The buyer is not pleased, but respects that you said it to their face.
  - *VI:* Khách không hài lòng, nhưng tôn trọng việc bạn nói thẳng với họ.
  - effects: rep.buyer +4, fact came_clean (witnessed)
- (30%, goes badly) The buyer appreciates the honesty and still trims next quarter's order.
  - *VI:* Khách đánh giá cao sự trung thực nhưng vẫn cắt bớt đơn quý sau.
  - effects: rep.buyer -3, stress +3

**c2.** Deny it and change the subject.  
*VI:* Chối và chuyển sang chuyện khác.

- (30%) The buyer lets it go, for now.
  - *VI:* Khách tạm bỏ qua.
  - effects: stress +2
- (70%, goes badly) The buyer already has the photos. The conversation ends coldly.
  - *VI:* Khách đã có ảnh. Cuộc trò chuyện kết thúc lạnh lùng.
  - effects: rep.buyer -10, stress +6

**c3.** Offer a discount on the next order to smooth it over.  
*VI:* Đề nghị giảm giá đơn tiếp theo để xoa dịu.

- (60%) The buyer takes the discount and lets the matter rest. It costs margin.
  - *VI:* Khách nhận giảm giá và cho qua chuyện này. Bạn mất biên lợi nhuận.
  - effects: rep.buyer +2, rep.boss -2
- (40%, goes badly) The buyer takes the discount and still remembers.
  - *VI:* Khách nhận giảm giá nhưng vẫn nhớ chuyện đó.
  - effects: rep.buyer -4, rep.boss -3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.compliance_interview

*random; tags: consequence, integrity, compliance*

- **Compliance officer:** We received a report about a payment connected to your accounts. This is a routine conversation.
  - *VI* **Cán bộ tuân thủ:** Chúng tôi nhận được một báo cáo về một khoản tiền liên quan đến các khách hàng của bạn. Đây chỉ là buổi trao đổi thông thường.
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
- (70%, goes badly) They have the invoices and the messages. Lying to them is the worse offence.
  - *VI:* Họ có hóa đơn và tin nhắn. Nói dối họ là lỗi nặng hơn.
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

## sales.first_big_order

*beat, weeks 1-3; tags: onboarding, people, beat*

- **Mr Bao:** Good timing. Mr Anders is sending his first big order this month. Twenty thousand pots. It is the order that decides whether we become his main supplier. I will be honest: the delivery date he wants is tight.
  - *VI* **Anh Bảo:** Đúng lúc lắm. Ông Anders sắp gửi đơn lớn đầu tiên trong tháng này. Hai mươi nghìn chiếc nồi. Đơn này quyết định mình có thành nhà cung cấp chính của ông ấy không. Anh nói thật: ngày giao ông ấy muốn rất sát.
- **Mr Anders:** I have had three suppliers fail on dates this year. I do not need the cheapest. I need someone who tells me the truth when it is going to be late.
  - *VI* **Ông Anders:** Năm nay có ba nhà cung cấp trễ hạn với tôi. Tôi không cần rẻ nhất. Tôi cần người nói thật khi việc sắp trễ.

**c1.** Check the real capacity with Lan before you promise a date, and give Anders a date you can defend.  
*VI:* Kiểm công suất thật với chị Lan trước khi hứa ngày và đưa cho ông Anders một ngày bảo vệ được.

- (80%) The date is nine days later than Anders wanted. He pauses, then: 'That I can plan around.' Bao is nervous, Lan is grateful. You have a real date.
  - *VI:* Ngày giao trễ hơn ông Anders muốn chín ngày. Ông ngừng một lúc rồi nói: 'Cái này tôi lên kế hoạch được.' Anh Bảo lo, chị Lan biết ơn. Anh/chị có một ngày thật.
  - effects: rel.anders.trust +6, rel.lan.trust +3, rel.bao.trust -2, stress +2
- (20%, goes badly) Anders says nine days is too late and gives the first tranche to a rival. You keep the second. It is an honest loss.
  - *VI:* Ông Anders nói chín ngày là quá trễ và giao đợt đầu cho đối thủ. Anh/chị giữ đợt hai. Một thất bại trung thực.
  - effects: rel.anders.trust +2, rel.bao.trust -5, rep.buyer -2, stress +3

**c2.** Promise a date in between and ask Lan to try her best to meet it.  
*VI:* Hứa một ngày ở giữa và nhờ chị Lan cố hết sức để kịp.

- (100%) Anders accepts. Lan says, 'I will try', and you both know what that means. It may hold, or it may not.
  - *VI:* Ông Anders chấp nhận. Chị Lan nói 'Em sẽ cố', và cả hai đều biết điều đó nghĩa là gì. Có thể giữ được, có thể không.
  - effects: rel.anders.trust +2, rel.lan.trust -1, rel.bao.trust +2, stress +2

**c3.** Promise him exactly the date he asked for and sort out production afterwards.  
*VI:* Hứa đúng ngày ông ấy yêu cầu và xử lý sản xuất sau.

- (70%) Anders is delighted. Bao claps your shoulder. Lan hears about the date from Bao, in the corridor.
  - *VI:* Ông Anders rất vui. Anh Bảo vỗ vai anh/chị. Chị Lan nghe về ngày giao từ anh Bảo, ngoài hành lang.
  - effects: rel.anders.trust +5, rel.bao.trust +5, rel.lan.trust -6, stress +1, fact promised_unrealistic_date (private)
- (30%, goes badly) Lan says, in front of Bao, that the date is impossible and that nobody asked her. The room goes cold.
  - *VI:* Chị Lan nói trước mặt anh Bảo rằng ngày đó bất khả thi và không ai hỏi chị. Căn phòng lạnh đi.
  - effects: rel.anders.trust +3, rel.bao.trust -2, rel.lan.trust -9, stress +4, fact promised_unrealistic_date (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.discount_expected

*comes from a storyline; tags: buyer, pricing, dark, arc*

- **Mr Anders:** For the next order I assume the same price as last time. Six percent off list. I have already told my own board. Is there a problem?
  - *VI* **Ông Anders:** Cho đơn tiếp theo tôi giả định giá như lần trước. Giảm sáu phần trăm so với giá niêm yết. Tôi đã báo với hội đồng của mình rồi. Có vấn đề gì không?

**c1.** Explain plainly that the six percent was a one-time deal tied to volume, and offer a tiered price for this order.  
*VI:* Giải thích rõ rằng sáu phần trăm là thỏa thuận một lần gắn với sản lượng và đề xuất giá theo bậc cho đơn này.

- (70%) Anders is not pleased but he respects the clarity. 'Fine. I will tell my board it was a promotion.' The price holds at four percent.
  - *VI:* Ông Anders không hài lòng nhưng tôn trọng sự rõ ràng. 'Được. Tôi sẽ báo hội đồng đó là khuyến mãi.' Giá giữ ở mức bốn phần trăm.
  - effects: rel.anders.trust +2, rel.bao.trust +1, stress +2, arc discount_spiral: end
- (30%, goes badly) Anders says he will look at other suppliers. You hold the line. The order shrinks by a third.
  - *VI:* Ông Anders nói sẽ xem các nhà cung cấp khác. Anh/chị giữ lập trường. Đơn hàng giảm một phần ba.
  - effects: rel.anders.trust -4, rel.bao.trust -3, rep.buyer -2, stress +4, arc discount_spiral: end

**c2.** Offer four percent and ask Duc to approve the margin impact in writing.  
*VI:* Đề xuất bốn phần trăm và nhờ anh Đức duyệt ảnh hưởng biên lợi nhuận bằng văn bản.

- (100%) Duc signs a reduced discount with a note on volume. It is slow but it is on paper, and Anders accepts the smaller number.
  - *VI:* Anh Đức ký khoản giảm giá thấp hơn kèm ghi chú về sản lượng. Chậm nhưng có giấy tờ, và ông Anders chấp nhận con số nhỏ hơn.
  - effects: rel.anders.trust +1, rel.duc.trust +3, stress +1, arc discount_spiral: review

**c3.** Say yes to six percent again and deal with the approval later.  
*VI:* Nhận lời sáu phần trăm lần nữa và xử lý phê duyệt sau.

- (80%) Anders thanks you. The order is large. The discount sits outside your authority for the second time.
  - *VI:* Ông Anders cảm ơn. Đơn hàng lớn. Khoản giảm giá lần thứ hai nằm ngoài thẩm quyền của anh/chị.
  - effects: rel.anders.trust +5, rel.bao.trust +1, stress -1, fact discount_above_limit (private), arc discount_spiral: review
- (20%, goes badly) Duc sees the price on the order confirmation and calls you in. He asks whether this is the first time.
  - *VI:* Anh Đức thấy giá trên xác nhận đơn hàng và gọi anh/chị vào. Anh hỏi đây có phải lần đầu không.
  - effects: rel.anders.trust +3, rel.duc.trust -6, rep.boss -3, stress +4, fact discount_above_limit (witnessed), arc discount_spiral: review

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.margin_review

*comes from a storyline; tags: pricing, finance, dark, arc*

- **Mr Duc:** I am reviewing margins by customer. Anders's account is down six points in a year. The directors want to know whether the growth is worth it. I need you to walk me through what you agreed and why.
  - *VI* **Anh Đức:** Anh đang soát biên lợi nhuận theo khách hàng. Tài khoản ông Anders giảm sáu điểm trong một năm. Ban giám đốc muốn biết tăng trưởng có đáng không. Anh cần em kể lại những gì đã thỏa thuận và vì sao.

**c1.** Show him every discount, its approval and its reasoning, including the ones you would now do differently.  
*VI:* Cho anh ấy xem mọi khoản giảm giá, việc phê duyệt và lý do, kể cả những khoản anh/chị giờ sẽ làm khác.

- (100%) Duc reads the file for an hour. 'Honest, and more useful than a clean story.' The directors set a margin floor for the account, and you help design it.
  - *VI:* Anh Đức đọc hồ sơ một giờ. 'Trung thực, và có ích hơn một câu chuyện sạch.' Ban giám đốc đặt mức sàn biên cho tài khoản, và anh/chị giúp thiết kế nó.
  - effects: rel.duc.trust +5, rel.bao.trust -1, rep.boss +2, stress +3, arc discount_spiral: end

**c2.** Present the numbers, framed as the price of winning the account, and propose a recovery plan.  
*VI:* Trình bày số liệu như cái giá để giành tài khoản và đề xuất kế hoạch phục hồi.

- (100%) Duc accepts the framing with a raised eyebrow. The recovery plan is reasonable and you will be held to it.
  - *VI:* Anh Đức chấp nhận cách trình bày với một cái nhướng mày. Kế hoạch phục hồi hợp lý và anh/chị sẽ bị yêu cầu thực hiện.
  - effects: rel.duc.trust +1, stress +2, arc discount_spiral: end

**c3.** Show the price list and the freight lines, and let the unapproved discounts stay buried in the freight.  
*VI:* Cho xem bảng giá và các dòng cước vận chuyển và để các khoản giảm giá không được duyệt nằm lẫn trong cước.

- (60%) Duc sees healthy margins on the product lines and accepts the freight as a market cost. You close the file before he asks again.
  - *VI:* Anh Đức thấy biên tốt ở các dòng sản phẩm và chấp nhận cước vận chuyển như chi phí thị trường. Anh/chị đóng hồ sơ trước khi anh hỏi lại.
  - effects: rel.duc.trust +2, stress +1, fact buried_discount_in_freight (private), arc discount_spiral: end
- (40%, goes badly) Hanh in Finance notices the freight charged to Anders is half the average. She says nothing in the meeting, and sends Duc a two-line email afterwards.
  - *VI:* Chị Hạnh ở Tài chính thấy cước tính cho ông Anders bằng một nửa mức trung bình. Chị không nói gì trong cuộc họp và gửi anh Đức email hai dòng sau đó.
  - effects: rel.duc.trust -8, rep.boss -5, stress +5, fact buried_discount_in_freight (witnessed), arc discount_spiral: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.overdue_pull_in

*comes from a storyline; tags: receivables, pressure, dark, arc*

- **Mr Bao:** The overdue balance is going to hurt our quarter numbers. Here is an idea: the next order from that buyer is ready early. Ship it now, invoice it now, and the quarter looks fine. The buyer gets goods they were going to get anyway.
  - *VI* **Anh Bảo:** Khoản nợ quá hạn sẽ làm tổn thương số liệu quý của mình. Anh có một ý: đơn tiếp theo của khách đó đã sẵn sàng sớm. Giao ngay, xuất hóa đơn ngay, quý sẽ ổn. Khách nhận hàng họ vốn sẽ nhận.

**c1.** Decline: they have not paid the last one, and shipping more adds risk. Offer to chase the overdue balance with Finance's help.  
*VI:* Từ chối: họ chưa trả đơn trước, giao thêm chỉ tăng rủi ro. Đề nghị cùng Tài chính đòi khoản quá hạn.

- (80%) Bao frowns, then sighs. Hanh and you agree a call plan with the buyer's AP. The money comes in three weeks later. The quarter is weaker, and truer.
  - *VI:* Anh Bảo cau mày rồi thở dài. Chị Hạnh và anh/chị thống nhất kế hoạch gọi cho bộ phận phải trả của khách. Tiền về ba tuần sau. Quý yếu hơn, và đúng hơn.
  - effects: rel.bao.trust -4, rel.hanh.trust +3, rel.duc.trust +2, stress +2, arc overdue_account: end
- (20%, goes badly) The buyer does not pay at all that quarter, and Bao reminds you of his offer. You had a point, at a price.
  - *VI:* Khách không trả gì trong quý đó, và anh Bảo nhắc anh/chị về đề nghị của anh. Anh/chị có lý, nhưng phải trả giá.
  - effects: rel.bao.trust -6, rel.hanh.trust +3, stress +4, arc overdue_account: end

**c2.** Offer to ship early only if the buyer agrees in writing to the earlier date, and pay the next invoice on the normal terms.  
*VI:* Đề nghị giao sớm chỉ khi khách đồng ý bằng văn bản về ngày sớm hơn và thanh toán hóa đơn tiếp theo theo điều khoản thường.

- (100%) It is legitimate: the buyer wants the goods early anyway. The revenue is real and the paper trail is clean. Bao is pleased, Finance approves.
  - *VI:* Hợp lệ: khách vốn muốn hàng sớm. Doanh thu là thật và hồ sơ sạch. Anh Bảo hài lòng, Tài chính chấp thuận.
  - effects: rel.bao.trust +3, rel.duc.trust +1, stress +1, arc overdue_account: end

**c3.** Ship it early without telling the buyer it is early, and invoice it now.  
*VI:* Giao sớm mà không nói với khách là sớm và xuất hóa đơn ngay.

- (70%) The quarter closes beautifully. The buyer's goods-received clerk signs for pots nobody expected, and the paperwork is ready.
  - *VI:* Quý khép lại đẹp. Nhân viên nhận hàng của khách ký nhận những chiếc nồi chẳng ai mong đợi, và giấy tờ đã sẵn sàng.
  - effects: rel.bao.trust +7, rel.bao.owed +2, stress -1, fact pulled_shipment_in (private), arc overdue_account: end
- (30%, goes badly) The buyer's warehouse is full and refuses the delivery. The pots sit in a bonded warehouse at your cost, and the invoice is disputed.
  - *VI:* Kho của khách đầy và từ chối nhận hàng. Nồi nằm trong kho ngoại quan do công ty chịu phí, và hóa đơn bị tranh chấp.
  - effects: rel.bao.trust +3, rel.hanh.trust -5, rep.buyer -6, rep.boss -4, stress +5, fact pulled_shipment_in (witnessed), arc overdue_account: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.quynh_copies_you

*comes from a storyline; tags: people, dark, arc*

- **Quynh:** I did my first quote alone, and I thought I would do it the way you do. I gave the buyer the date that sounded best and promised to check production afterwards. Is that right? It is what I saw.
  - *VI* **Quỳnh:** Em tự làm báo giá đầu tiên và nghĩ mình sẽ làm theo cách anh/chị làm. Em cho khách ngày nghe hay nhất và hứa kiểm tra sản xuất sau. Vậy có đúng không ạ? Đó là điều em đã thấy.

**c1.** Tell her it is not right, explain why, and go through the quote together and fix it.  
*VI:* Nói với em là không đúng, giải thích vì sao và cùng xem lại báo giá rồi sửa.

- (100%) Quynh listens carefully and rewrites the quote with a date Lan approved. She says, 'I was only copying. I am glad you told me.' You feel the weight of being copied.
  - *VI:* Quỳnh lắng nghe cẩn thận và viết lại báo giá với ngày chị Lan đã duyệt. Em nói: 'Em chỉ bắt chước thôi. Em mừng vì anh/chị nói.' Anh/chị cảm nhận sức nặng của việc bị bắt chước.
  - effects: rel.quynh.trust +6, rel.quynh.loyalty +4, rel.lan.trust +1, stress +1, arc quynh: end

**c2.** Tell her the rule, but say that in practice everyone does it, so she should be careful who finds out.  
*VI:* Nói với em quy tắc nhưng bảo rằng thực tế ai cũng làm, nên em cần cẩn thận ai biết.

- (100%) Quynh nods slowly. She does not look reassured. She has learned that the rule and the practice are two different things.
  - *VI:* Quỳnh gật đầu chậm. Em không có vẻ yên tâm. Em đã học được rằng quy tắc và thực tế là hai chuyện khác nhau.
  - effects: rel.quynh.trust +1, stress +1, arc quynh: caught

**c3.** Tell her it is fine, that is how deals get made, and not to worry about production.  
*VI:* Nói với em là ổn, đó là cách chốt đơn, và đừng lo về sản xuất.

- (75%) Quynh beams. You have made an ally, and set her on the same path. She starts telling the new hire the same thing.
  - *VI:* Quỳnh rạng rỡ. Anh/chị đã có một đồng minh, và đặt em lên cùng con đường. Em bắt đầu nói điều đó với nhân viên mới.
  - effects: rel.quynh.trust +5, rel.quynh.loyalty +5, stress -1, fact approved_quynh_shortcut (private), arc quynh: caught
- (25%, goes badly) Bao overhears Quynh telling a buyer, in your exact words, that production can be sorted out later. He looks at you across the office.
  - *VI:* Anh Bảo nghe Quỳnh nói với khách, đúng từng chữ của anh/chị, rằng sản xuất có thể xử lý sau. Anh nhìn anh/chị qua văn phòng.
  - effects: rel.quynh.trust +3, rel.bao.trust -5, rep.boss -3, stress +3, fact approved_quynh_shortcut (witnessed), arc quynh: caught

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.quynh_caught

*comes from a storyline; tags: people, dark, consequence, arc*

- **Mr Bao:** Quynh promised a delivery date to a buyer that Lan says is impossible. The buyer has complained. Quynh says, honestly, that she learned it from watching you. I would like to hear your account.
  - *VI* **Anh Bảo:** Quỳnh hứa với khách một ngày giao mà chị Lan nói là không thể. Khách đã khiếu nại. Quỳnh nói, thật lòng, rằng em học điều đó từ việc nhìn anh/chị. Anh muốn nghe lời kể của em.

**c1.** Take responsibility for what you modelled, protect Quynh from the worst of it, and help fix the order with the buyer.  
*VI:* Nhận trách nhiệm về điều anh/chị đã làm gương, bảo vệ Quỳnh khỏi phần tệ nhất và giúp sửa đơn hàng với khách.

- (100%) Bao is quiet, then says: 'That is what a senior does.' Quynh keeps her job and her respect for you. You carry the blame you earned.
  - *VI:* Anh Bảo im lặng rồi nói: 'Đó là việc của người đi trước.' Quỳnh giữ được việc và sự tôn trọng dành cho anh/chị. Anh/chị gánh phần lỗi mình xứng đáng nhận.
  - effects: rel.quynh.trust +7, rel.quynh.loyalty +6, rel.bao.trust +1, rep.boss -2, stress +4

**c2.** Say she should have checked the date herself; you never told her to skip production.  
*VI:* Nói em lẽ ra phải tự kiểm ngày; anh/chị chưa bao giờ bảo em bỏ qua sản xuất.

- (100%) It is technically true. Bao lets it stand. Quynh does not look at you again for a month.
  - *VI:* Đúng về mặt kỹ thuật. Anh Bảo để vậy. Quỳnh không nhìn anh/chị nữa trong một tháng.
  - effects: rel.quynh.trust -8, rel.quynh.loyalty -6, rel.bao.trust -1, stress +2

**c3.** Say Quynh is inexperienced and it is her own mistake.  
*VI:* Nói Quỳnh thiếu kinh nghiệm và đó là lỗi của riêng em.

- (55%) Bao gives Quynh a formal warning. You keep your record clean. Quynh hears it from the corridor, and stops speaking to you.
  - *VI:* Anh Bảo cảnh cáo Quỳnh chính thức. Hồ sơ của anh/chị vẫn sạch. Quỳnh nghe chuyện ngoài hành lang và thôi nói chuyện với anh/chị.
  - effects: rel.quynh.trust -16, rel.quynh.loyalty -12, rel.bao.trust +1, stress +3, fact blamed_quynh (private)
- (45%, goes badly) Quynh has messages from you telling her not to worry about production. She shows them to Bao. He reads them twice.
  - *VI:* Quỳnh có tin nhắn của anh/chị bảo em đừng lo về sản xuất. Em đưa cho anh Bảo. Anh đọc hai lần.
  - effects: rel.quynh.trust -16, rel.bao.trust -10, rep.boss -8, stress +7, fact blamed_quynh (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.buyer_visit_factory

*random; tags: buyer, people, pressure*

- **Mr Anders:** I will be at your factory on Thursday. I want to see the line producing my order, the packing area and the finished goods store. I do not want a show. I want to see a normal day.
  - *VI* **Ông Anders:** Thứ Năm tôi sẽ đến nhà máy của anh/chị. Tôi muốn xem chuyền sản xuất đơn của tôi, khu đóng gói và kho thành phẩm. Tôi không muốn xem trình diễn. Tôi muốn xem một ngày bình thường.
- **Ms Lan:** Line 2 has a rework pile and the packing area is a mess. We could clear it for a day.
  - *VI* **Chị Lan:** Chuyền 2 có một đống hàng làm lại và khu đóng gói rất bừa. Mình có thể dọn trong một ngày.

**c1.** Show Anders the normal day, including the rework pile, and explain how you deal with it.  
*VI:* Cho ông Anders xem ngày bình thường, kể cả đống hàng làm lại, và giải thích cách xử lý.

- (80%) Anders spends an hour at the rework pile asking questions. On the way out he says: 'You are the first supplier who did not hide it.' Lan is relieved.
  - *VI:* Ông Anders dành một giờ ở đống hàng làm lại để hỏi. Khi ra về ông nói: 'Anh/chị là nhà cung cấp đầu tiên không giấu nó.' Chị Lan nhẹ nhõm.
  - effects: rel.anders.trust +8, rel.lan.trust +2, rep.buyer +3, stress +3
- (20%, goes badly) Anders finds a real quality issue in the rework pile and raises it with the directors. It is uncomfortable, but it is fixed in a week.
  - *VI:* Ông Anders phát hiện một vấn đề chất lượng thật trong đống hàng làm lại và nêu với ban giám đốc. Khó chịu, nhưng được sửa trong một tuần.
  - effects: rel.anders.trust +4, rel.bao.trust -3, stress +4

**c2.** Tidy the obvious mess, but do not hide anything, and answer every question.  
*VI:* Dọn chỗ bừa rõ ràng nhưng không giấu gì và trả lời mọi câu hỏi.

- (100%) A clean, honest visit. Anders notes the tidiness and the answers, and moves on to the packing spec.
  - *VI:* Một chuyến thăm sạch và trung thực. Ông Anders ghi nhận sự gọn gàng và các câu trả lời rồi chuyển sang quy cách đóng gói.
  - effects: rel.anders.trust +3, rel.lan.trust +1, stress +2

**c3.** Clear the rework pile and stage a perfect line for the visit.  
*VI:* Dọn đống hàng làm lại và dựng một chuyền hoàn hảo cho buổi thăm.

- (65%) The visit is flawless. Anders is impressed. Lan's team works through the night to do it, and you know it is not a normal day.
  - *VI:* Chuyến thăm hoàn hảo. Ông Anders ấn tượng. Đội của chị Lan làm xuyên đêm để kịp, và anh/chị biết đó không phải ngày bình thường.
  - effects: rel.anders.trust +3, rel.lan.trust -3, stress +1, fact staged_factory_visit (private)
- (35%, goes badly) Anders asks to see the rework pile and is shown an empty floor. A worker says quietly, in English, that it was moved this morning.
  - *VI:* Ông Anders xin xem đống hàng làm lại và được cho xem một sàn trống. Một công nhân nói khẽ bằng tiếng Anh rằng nó được chuyển sáng nay.
  - effects: rel.anders.trust -12, rel.bao.trust -6, rep.buyer -8, stress +5, fact staged_factory_visit (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.quota_push

*random; tags: pressure, people*

- **Mr Bao:** We are at 91 percent of quota with two weeks left. The directors will ask me about it on Friday. I need you to find the other nine percent. However you can. Do not tell me how.
  - *VI* **Anh Bảo:** Mình đang ở 91 phần trăm chỉ tiêu, còn hai tuần. Ban giám đốc sẽ hỏi anh vào thứ Sáu. Anh cần em tìm chín phần trăm còn lại. Bằng mọi cách. Đừng nói cho anh biết bằng cách nào.

**c1.** Review the pipeline honestly, tell Bao which deals are real this quarter, and give him a number you can stand behind.  
*VI:* Rà pipeline trung thực, nói với anh Bảo những đơn nào thật trong quý và đưa một con số anh/chị đảm bảo được.

- (75%) The real number is 96 percent. Bao is disappointed, then practical: 'I can defend 96 honestly. I could not defend 100.' The directors are unhappy but not surprised.
  - *VI:* Con số thật là 96 phần trăm. Anh Bảo thất vọng rồi thực tế: 'Anh bảo vệ 96 một cách trung thực được. Anh không bảo vệ nổi 100.' Ban giám đốc không vui nhưng không bất ngờ.
  - effects: rel.bao.trust +2, rep.boss +1, stress +3
- (25%, goes badly) The number is 93. Bao is silent for a long moment. You have given him nothing he can spin, and he knows it was honest.
  - *VI:* Con số là 93. Anh Bảo im lặng rất lâu. Anh/chị không cho anh thứ gì để tô vẽ, và anh biết điều đó trung thực.
  - effects: rel.bao.trust -3, stress +4

**c2.** Ask two buyers whether they would bring forward a planned order by a few weeks, openly, for a small incentive.  
*VI:* Hỏi hai khách xem họ có đẩy sớm một đơn đã dự kiến vài tuần không, công khai, đổi lấy một ưu đãi nhỏ.

- (60%) One buyer agrees. The pull-forward is real and documented. It gets you to 96, honestly. Bao is pleased.
  - *VI:* Một khách đồng ý. Việc đẩy sớm là thật và có hồ sơ. Đưa anh/chị lên 96, một cách trung thực. Anh Bảo hài lòng.
  - effects: rel.bao.trust +4, rel.anders.trust -1, stress +2
- (40%, goes badly) Both buyers say no, and one mentions to his colleague that you seem desperate. It does not help the quarter.
  - *VI:* Cả hai khách từ chối, và một người nói với đồng nghiệp rằng anh/chị có vẻ tuyệt vọng. Không giúp gì cho quý.
  - effects: rel.bao.trust -1, rep.buyer -2, stress +3

**c3.** Book orders that are not confirmed yet as 'expected' and let them count.  
*VI:* Ghi các đơn chưa xác nhận là 'dự kiến' và để chúng được tính.

- (70%) The quota shows 101 percent. Bao does not ask, and thanks you, carefully. The unconfirmed orders might come in.
  - *VI:* Chỉ tiêu hiển thị 101 phần trăm. Anh Bảo không hỏi, và cảm ơn anh/chị, một cách thận trọng. Các đơn chưa xác nhận có thể về.
  - effects: rel.bao.trust +7, rep.boss +4, stress -1, fact padded_quota_orders (private)
- (30%, goes badly) Two of the orders do not materialise. Duc notices the gap between bookings and invoices at quarter end and asks Bao about it.
  - *VI:* Hai đơn không thành. Anh Đức nhận ra khoảng cách giữa đơn và hóa đơn vào cuối quý và hỏi anh Bảo.
  - effects: rel.bao.trust +2, rel.duc.trust -6, rep.boss -5, stress +5, fact padded_quota_orders (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.credit_ask

*random; tags: buyer, risk, dark*

- **Mr Anders:** We would like to increase the next order considerably. Our payment terms will be ninety days, not sixty. I understand you have credit limits, but I am sure we can find a way.
  - *VI* **Ông Anders:** Chúng tôi muốn tăng đơn tiếp theo đáng kể. Điều khoản thanh toán của chúng tôi sẽ là chín mươi ngày, không phải sáu mươi. Tôi hiểu anh/chị có hạn mức tín dụng, nhưng tôi chắc mình tìm được cách.

**c1.** Explain the credit limit, and offer to ask Finance for a formal review of the buyer's credit with the numbers.  
*VI:* Giải thích hạn mức tín dụng và đề nghị nhờ Tài chính soát xét chính thức tín dụng của khách kèm số liệu.

- (80%) Finance approves a moderate increase with a guarantee from the buyer's bank. Anders accepts: 'That is how it should be done.'
  - *VI:* Tài chính duyệt mức tăng vừa phải kèm bảo lãnh từ ngân hàng của khách. Ông Anders chấp nhận: 'Đúng là phải làm như vậy.'
  - effects: rel.anders.trust +4, rel.duc.trust +3, rel.bao.trust +1, stress +2
- (20%, goes badly) Finance declines the increase. Anders is disappointed and splits the order with a rival. It is a clean loss.
  - *VI:* Tài chính từ chối tăng. Ông Anders thất vọng và chia đơn cho đối thủ. Một thất bại sạch.
  - effects: rel.anders.trust -2, rel.duc.trust +3, rel.bao.trust -4, stress +3

**c2.** Offer the larger order at sixty-day terms, with a small prepayment.  
*VI:* Đề nghị đơn lớn hơn với điều khoản sáu mươi ngày kèm một khoản trả trước nhỏ.

- (100%) Anders haggles for a day and accepts. The terms stay within policy and the order is large.
  - *VI:* Ông Anders mặc cả một ngày rồi chấp nhận. Điều khoản nằm trong chính sách và đơn hàng lớn.
  - effects: rel.anders.trust +2, rel.duc.trust +1, stress +1

**c3.** Agree to ninety days and keep the extended credit off the credit report.  
*VI:* Đồng ý chín mươi ngày và để khoản tín dụng kéo dài không xuất hiện trong báo cáo tín dụng.

- (75%) The order is signed. The credit exposure is not where Finance looks. You have given Anders something he will remember.
  - *VI:* Đơn được ký. Khoản rủi ro tín dụng không nằm ở chỗ Tài chính nhìn. Anh/chị đã cho ông Anders một điều ông sẽ nhớ.
  - effects: rel.anders.trust +6, rel.bao.trust +4, stress +1, fact credit_above_limit (private)
- (25%, goes badly) Anders's company delays payment by a further month. The exposure shows up on Duc's cash forecast, and so does your name.
  - *VI:* Công ty ông Anders trì hoãn thanh toán thêm một tháng. Rủi ro hiện trên dự báo tiền của anh Đức, và tên anh/chị cũng vậy.
  - effects: rel.anders.trust +2, rel.duc.trust -7, rep.boss -5, stress +5, fact credit_above_limit (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.expense_padding

*random; tags: people, integrity, dark*

- **Mr Bao:** When you submit your trade fair expenses, add something for the dinner with the buyers last week, will you? We had it in the office, but it makes the claim look better, and the sales budget will go unused otherwise.
  - *VI* **Anh Bảo:** Khi em nộp chi phí hội chợ, em thêm một khoản cho bữa tối với khách tuần trước nhé? Bọn mình ăn ở văn phòng, nhưng làm bảng kê đẹp hơn, và ngân sách kinh doanh nếu không dùng sẽ bị cắt.

**c1.** Submit the true expenses only, and tell Bao you would rather not make claims for things that did not happen.  
*VI:* Chỉ nộp chi phí thật và nói với anh Bảo anh/chị không muốn kê khai những việc không xảy ra.

- (85%) Bao shrugs: 'Fine. Suit yourself.' It costs a little warmth, and Hanh in Finance notices a clean claim.
  - *VI:* Anh Bảo nhún vai: 'Được. Tùy em.' Mất chút thiện cảm, và chị Hạnh ở Tài chính để ý một bảng kê sạch.
  - effects: rel.bao.trust -3, rel.hanh.trust +2, stress +1
- (15%, goes badly) Bao says he will remember you were difficult when bonuses come round. The budget goes unused, as he predicted.
  - *VI:* Anh Bảo nói sẽ nhớ anh/chị làm khó khi đến kỳ thưởng. Ngân sách không dùng hết, đúng như anh dự đoán.
  - effects: rel.bao.trust -7, rel.hanh.trust +2, stress +3

**c2.** Offer to claim for a real planned client dinner instead, properly booked.  
*VI:* Đề nghị kê khai cho một bữa tối khách hàng thật đã lên kế hoạch thay vào đó, hạch toán đúng.

- (100%) Bao laughs, 'You are a funny one,' and arranges a real dinner with Anders. The budget is used, and the claim is true.
  - *VI:* Anh Bảo cười: 'Em thú vị đấy,' và sắp xếp một bữa tối thật với ông Anders. Ngân sách được dùng và bảng kê đúng.
  - effects: rel.bao.trust +1, rel.anders.trust +2, stress +1

**c3.** Add the dinner to the claim.  
*VI:* Thêm bữa tối vào bảng kê.

- (80%) It is approved without comment. Bao grins. It is not a large amount, and that is exactly what makes it easy.
  - *VI:* Được duyệt không bình luận. Anh Bảo cười. Khoản không lớn, và chính điều đó làm nó dễ dàng.
  - effects: rel.bao.trust +5, stress +1, fact padded_expense_claim (private)
- (20%, goes badly) Hanh in Finance asks for the receipt for a dinner 'for eight'. There was none. The claim is returned, with a polite note.
  - *VI:* Chị Hạnh ở Tài chính yêu cầu hóa đơn cho bữa tối 'tám người'. Không có. Bảng kê bị trả lại kèm ghi chú lịch sự.
  - effects: rel.bao.trust +2, rel.hanh.trust -6, rep.boss -4, stress +4, fact padded_expense_claim (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.midyear_review

*beat, weeks 24-28; tags: people, review, beat*

- **Mr Bao:** Mid-year. Your numbers are decent. Mr Anders speaks well of you, Finance says you are careful, and Lan says you are the salesperson who asks her first. That last one is unusual. What do you think you are good at, and what do you want to be known for?
  - *VI* **Anh Bảo:** Giữa năm. Số liệu của em khá. Ông Anders nói tốt về em, Tài chính nói em cẩn thận và chị Lan nói em là nhân viên kinh doanh hỏi chị đầu tiên. Điều cuối khá hiếm. Em nghĩ em giỏi gì và muốn được biết đến vì điều gì?

**c1.** Say you want to be known as the person buyers can trust and colleagues can plan around, even if it costs some quota.  
*VI:* Nói rằng anh/chị muốn được biết đến là người khách hàng tin được và đồng nghiệp lên kế hoạch cùng được, kể cả khi mất một chút chỉ tiêu.

- (75%) Bao nods slowly. 'That is rare. I will need you to show it when the pressure comes.' He writes something down.
  - *VI:* Anh Bảo gật đầu chậm. 'Hiếm đấy. Anh cần em chứng tỏ khi áp lực đến.' Anh ghi gì đó.
  - effects: rel.bao.trust +3, rep.boss +2, stress -1
- (25%, goes badly) Bao says, flatly, that buyers trust whoever delivers the numbers. The conversation is polite and he is not convinced.
  - *VI:* Anh Bảo nói thẳng rằng khách tin người mang lại số liệu. Cuộc nói chuyện lịch sự và anh không bị thuyết phục.
  - effects: rel.bao.trust -2, stress +2

**c2.** Say you want to hit your numbers and be promoted, and ask what he needs from you.  
*VI:* Nói anh/chị muốn đạt chỉ tiêu và được thăng tiến và hỏi anh cần gì ở mình.

- (100%) Bao smiles: 'That is a clear answer.' He sets two stretch targets. Both are achievable, one of them tempting.
  - *VI:* Anh Bảo cười: 'Một câu trả lời rõ ràng.' Anh đặt hai chỉ tiêu nâng cao. Cả hai đều đạt được, một trong hai đầy cám dỗ.
  - effects: rel.bao.trust +2, rep.boss +1, stress +2

**c3.** Say whatever he seems to want to hear.  
*VI:* Nói bất cứ điều gì anh có vẻ muốn nghe.

- (60%) Bao is pleased and promises to 'look after you'. You leave unsure what you said.
  - *VI:* Anh Bảo hài lòng và hứa 'chăm sóc em'. Anh/chị ra về không chắc mình đã nói gì.
  - effects: rel.bao.trust +3, stress +1
- (40%, goes badly) Bao asks a follow-up that contradicts what you said. You realise he already knew your real view, and was giving you a chance.
  - *VI:* Anh Bảo hỏi tiếp một câu mâu thuẫn với điều anh/chị nói. Anh/chị nhận ra anh đã biết quan điểm thật của mình và đang cho cơ hội.
  - effects: rel.bao.trust -5, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.big_buyer_threatens

*beat, weeks 29-32; tags: buyer, pressure, beat*

- **Mr Anders:** I must tell you something. A competitor has offered me a price fourteen percent below yours, and a delivery guarantee. My board is asking why I do not switch. I would like to stay. Persuade me.
  - *VI* **Ông Anders:** Tôi phải nói với anh/chị một điều. Một đối thủ chào giá thấp hơn của anh/chị mười bốn phần trăm và có cam kết giao hàng. Hội đồng của tôi hỏi sao tôi không chuyển. Tôi muốn ở lại. Hãy thuyết phục tôi.
- **Mr Bao:** Match the price, whatever it takes. We cannot lose Anders. Do not come back to me until it is done.
  - *VI* **Anh Bảo:** Khớp giá, bằng mọi giá. Mình không thể mất ông Anders. Đừng quay lại gặp anh trước khi xong.

**c1.** Do not match the price. Show Anders the total cost of ownership: on-time record, quality record and what a failed delivery costs him.  
*VI:* Không khớp giá. Cho ông Anders xem tổng chi phí sở hữu: hồ sơ giao đúng hạn, hồ sơ chất lượng và một lần giao hỏng khiến ông thiệt bao nhiêu.

- (65%) Anders reads the numbers for a long time. 'You are more expensive and more honest. My board will grumble. I will stay, at a two percent adjustment.' Bao exhales.
  - *VI:* Ông Anders đọc số liệu rất lâu. 'Anh/chị đắt hơn và trung thực hơn. Hội đồng sẽ càu nhàu. Tôi sẽ ở lại, với điều chỉnh hai phần trăm.' Anh Bảo thở ra.
  - effects: rel.anders.trust +8, rel.bao.trust +3, rep.buyer +4, stress +4
- (35%, goes badly) Anders stays for half his volume and moves half to the competitor. Bao is angry. You lost the price argument and won the trust one.
  - *VI:* Ông Anders ở lại với nửa sản lượng và chuyển nửa sang đối thủ. Anh Bảo giận. Anh/chị thua tranh luận về giá nhưng thắng ở lòng tin.
  - effects: rel.anders.trust +5, rel.bao.trust -6, rep.buyer -2, stress +6

**c2.** Offer a moderate price reduction within your authority, tied to a twelve-month volume commitment.  
*VI:* Đề xuất giảm giá vừa phải trong thẩm quyền, gắn với cam kết sản lượng mười hai tháng.

- (100%) Anders accepts a compromise: three percent and a longer contract. Bao says it is not enough, but it is honest, and it is what you can sign.
  - *VI:* Ông Anders chấp nhận một thỏa hiệp: ba phần trăm và hợp đồng dài hơn. Anh Bảo nói chưa đủ, nhưng trung thực và là điều anh/chị ký được.
  - effects: rel.anders.trust +3, rel.bao.trust -1, stress +3

**c3.** Match the price, and work out how to recover the margin later.  
*VI:* Khớp giá và tính cách phục hồi biên lợi nhuận sau.

- (70%) Anders stays, delighted. Bao hugs you. The margin on his account drops to a number that will need an explanation.
  - *VI:* Ông Anders ở lại, rất vui. Anh Bảo ôm anh/chị. Biên lợi nhuận tài khoản ông giảm xuống một con số sẽ cần được giải thích.
  - effects: rel.anders.trust +4, rel.bao.trust +6, stress +1, fact discount_above_limit (private)
- (30%, goes badly) Anders uses your matched price to negotiate the competitor's price down further. He is not loyal, he is shopping. You learn it the hard way.
  - *VI:* Ông Anders dùng giá anh/chị vừa khớp để ép giá đối thủ xuống thêm. Ông không trung thành, ông đi so giá. Anh/chị học điều đó theo cách đau.
  - effects: rel.anders.trust -4, rel.bao.trust +2, rep.boss -3, stress +5, fact discount_above_limit (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.anders_renewal

*random; tags: buyer, people, reward*

- **Mr Anders:** You have been the most honest supplier I have worked with. I would like to make you my main supplier for next year, with a three-year framework. The price is for you to propose. I will trust it.
  - *VI* **Ông Anders:** Anh/chị là nhà cung cấp trung thực nhất tôi từng làm việc. Tôi muốn đưa anh/chị thành nhà cung cấp chính của tôi cho năm sau, với hợp đồng khung ba năm. Giá để anh/chị đề xuất. Tôi sẽ tin nó.

**c1.** Propose a fair price with a clear review clause, and tell him what you will and will not promise.  
*VI:* Đề xuất một mức giá hợp lý kèm điều khoản xem xét rõ ràng và nói với ông điều anh/chị sẽ và sẽ không hứa.

- (100%) Anders signs the framework the next week. Bao is overjoyed. The contract has your honesty written into its review clause, and it is the best deal of the year.
  - *VI:* Ông Anders ký hợp đồng khung tuần sau. Anh Bảo vui mừng. Hợp đồng có sự trung thực của anh/chị viết vào điều khoản xem xét, và là thương vụ tốt nhất năm.
  - effects: rel.anders.trust +5, rel.bao.trust +5, rep.buyer +6, rep.boss +5, stress +1

**c2.** Propose a fair price and quietly include a margin that would not survive his comparison.  
*VI:* Đề xuất giá hợp lý và lặng lẽ thêm một mức biên không chịu nổi sự so sánh của ông.

- (70%) Anders signs without checking. The margin is good, and Bao is delighted. You have used the trust he gave you.
  - *VI:* Ông Anders ký mà không kiểm tra. Biên tốt, và anh Bảo rất vui. Anh/chị đã dùng lòng tin ông trao.
  - effects: rel.anders.trust +2, rel.bao.trust +6, rep.boss +4, stress +1, fact exploited_buyer_trust (private)
- (30%, goes badly) Anders's analyst benchmarks the price against the market and reports the gap. Anders calls you himself, and he is quiet.
  - *VI:* Chuyên viên của ông Anders so giá với thị trường và báo khoảng chênh. Ông Anders tự gọi cho anh/chị, và ông rất trầm.
  - effects: rel.anders.trust -14, rel.bao.trust -4, rep.buyer -10, stress +6, fact exploited_buyer_trust (public)

**c3.** Thank him but say you cannot commit for three years, and propose one year with an option.  
*VI:* Cảm ơn ông nhưng nói anh/chị không thể cam kết ba năm và đề xuất một năm kèm quyền gia hạn.

- (100%) Anders laughs, surprised. 'I have never had a supplier refuse a longer contract.' He signs the one-year deal, and respects you more.
  - *VI:* Ông Anders cười, ngạc nhiên. 'Tôi chưa từng có nhà cung cấp nào từ chối hợp đồng dài hơn.' Ông ký hợp đồng một năm và tôn trọng anh/chị hơn.
  - effects: rel.anders.trust +4, rel.bao.trust -2, rep.buyer +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.year_end_review

*beat, weeks 49-50; tags: people, review, beat*

- **Mr Bao:** Annual review. Before I give you my view, tell me how you would rate your own year, and what you would do differently.
  - *VI* **Anh Bảo:** Đánh giá cuối năm. Trước khi anh nói quan điểm, em hãy tự chấm năm của mình và nói em sẽ làm khác đi điều gì.

**c1.** Give an honest account, including the promises you stretched and what they cost.  
*VI:* Kể thật lòng, kể cả những lời hứa anh/chị đã nới và cái giá của chúng.

- (100%) Bao is quiet, then says: 'That is more honest than I am with myself.' He writes: 'Reliable in the telling.'
  - *VI:* Anh Bảo im lặng rồi nói: 'Em trung thực hơn cả anh với chính mình.' Anh viết: 'Đáng tin khi kể lại.'
  - effects: rel.bao.trust +5, rep.boss +4, stress -2

**c2.** Stay modest: list the wins and one thing to improve.  
*VI:* Khiêm tốn: nêu các thắng lợi và một điều cần cải thiện.

- (100%) A safe review. Bao nods and moves on to the next topic.
  - *VI:* Một buổi đánh giá an toàn. Anh Bảo gật đầu và chuyển chủ đề.
  - effects: rel.bao.trust +1, rep.boss +1

**c3.** Present the year as a clean success and leave out the promises you bent.  
*VI:* Trình bày cả năm như một thành công sạch và bỏ qua các lời hứa anh/chị đã bẻ.

- (65%) It lands well, and you leave with a bonus recommendation and a small weight in your chest.
  - *VI:* Được đón nhận tốt, và anh/chị ra về với đề xuất thưởng và một chút nặng nề trong lòng.
  - effects: rel.bao.trust +2, rep.boss +4, stress +1, fact polished_year_review (private)
- (35%, goes badly) Bao has Lan's notes on the dates you promised. He puts them on the table without comment.
  - *VI:* Anh Bảo có ghi chú của chị Lan về các ngày anh/chị đã hứa. Anh đặt chúng lên bàn mà không bình luận.
  - effects: rel.bao.trust -8, rep.boss -5, stress +4, fact polished_year_review (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.manager_offer

*beat, weeks 51-52; tags: people, promotion, beat*

- **Mr Bao:** I am being moved up to regional director at the end of the year. The directors asked who should run export sales. I named you. One condition: you will be asked, every quarter, to reach numbers that are not quite reachable. I need to know what you will do.
  - *VI* **Anh Bảo:** Cuối năm anh được lên giám đốc khu vực. Ban giám đốc hỏi ai nên phụ trách bán hàng xuất khẩu. Anh nêu tên em. Một điều kiện: mỗi quý em sẽ được yêu cầu đạt những con số gần như không đạt nổi. Anh cần biết em sẽ làm gì.

**c1.** Accept, and say you will bring honest numbers and real options every time, and expect the directors to hear that too.  
*VI:* Nhận lời và nói rằng anh/chị sẽ mang số liệu trung thực và phương án thật mỗi lần, và mong ban giám đốc cũng nghe điều đó.

- (100%) Bao smiles. 'Then you are the right person.' You take over export sales with your terms understood, and with Anders's contract in your drawer.
  - *VI:* Anh Bảo cười. 'Vậy em là người phù hợp.' Anh/chị tiếp quản bán hàng xuất khẩu với điều kiện đã được hiểu và hợp đồng của ông Anders trong ngăn kéo.
  - effects: rel.bao.trust +5, rep.boss +5, ENDING promoted

**c2.** Thank him, but decline: you would rather sell than manage the pressure.  
*VI:* Cảm ơn anh nhưng từ chối: anh/chị muốn bán hàng hơn là quản lý áp lực.

- (100%) Bao looks disappointed, then understanding. 'The next manager may not be as careful as you.'
  - *VI:* Anh Bảo có vẻ thất vọng rồi thông cảm. 'Người quản lý tiếp theo có thể không cẩn thận như em.'
  - effects: rel.bao.trust +2, stress -3

**c3.** Accept without asking what the condition means in practice.  
*VI:* Nhận lời mà không hỏi điều kiện đó thực tế nghĩa là gì.

- (100%) Bao shakes your hand a little too warmly. You realise you agreed to something you did not ask about.
  - *VI:* Anh Bảo bắt tay anh/chị hơi quá nồng nhiệt. Anh/chị nhận ra mình đã đồng ý với điều mình không hỏi.
  - effects: rel.bao.trust +5, rep.boss +4, fact accepted_smoothing_condition (private), ENDING promoted

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.tet_bonus_team

*random; tags: pressure, people*

- **Mr Bao:** The sales team's Tet bonus depends on what ships before the holiday. Everyone is counting on it, including you. Lan says her line cannot do it. I say she can, if she is told it matters. Can you make it matter to her?
  - *VI* **Anh Bảo:** Thưởng Tết của cả phòng kinh doanh phụ thuộc vào hàng giao trước kỳ nghỉ. Ai cũng trông vào đó, kể cả anh/chị. Chị Lan nói chuyền của chị không làm nổi. Anh nói làm được nếu chị ấy biết việc này quan trọng. Anh/chị khiến chị ấy thấy điều đó quan trọng được không?

**c1.** Sit with Lan and build a shipping plan from what the line can really do, then tell the buyers the real dates.  
*VI:* Ngồi với chị Lan và lập kế hoạch giao hàng từ những gì chuyền thực sự làm được, rồi báo khách các ngày thật.

- (75%) The plan ships sixty percent before Tet, on dates the buyers accept. The bonus is smaller. Lan brings you tea the next day without a word.
  - *VI:* Kế hoạch giao sáu mươi phần trăm trước Tết, vào các ngày khách chấp nhận. Thưởng nhỏ hơn. Hôm sau chị Lan mang trà cho anh/chị mà không nói gì.
  - effects: rel.lan.trust +5, rel.bao.trust -3, rel.anders.trust +2, stress +2
- (25%, goes badly) One buyer will not accept the later date and cancels. The team bonus takes the hit, and the room remembers who brought the plan.
  - *VI:* Một khách không chấp nhận ngày muộn hơn và hủy đơn. Thưởng của nhóm chịu thiệt, và cả phòng nhớ ai đã mang kế hoạch đến.
  - effects: rel.lan.trust +4, rel.bao.trust -5, rep.buyer -2, stress +4

**c2.** Ask Lan which orders are safest to rush, and promise only those.  
*VI:* Hỏi chị Lan những đơn nào an toàn nhất để gấp và chỉ hứa những đơn đó.

- (100%) Lan picks three orders. They ship. The rest wait for January, honestly communicated. It is a workable, unheroic plan.
  - *VI:* Chị Lan chọn ba đơn. Chúng được giao. Phần còn lại chờ tháng Giêng, được thông báo trung thực. Một kế hoạch khả thi, không hào hùng.
  - effects: rel.lan.trust +3, rel.bao.trust +1, stress +1

**c3.** Promise the buyers their Tet dates, and tell Lan the dates are already fixed.  
*VI:* Hứa với khách đúng ngày Tết của họ và nói với chị Lan rằng các ngày đã chốt.

- (65%) Lan is furious and does it anyway. Most orders make the date. Two do not, and the buyer hears about it from you on the day.
  - *VI:* Chị Lan rất giận nhưng vẫn làm. Phần lớn đơn kịp ngày. Hai đơn thì không, và khách biết từ chính anh/chị vào đúng ngày đó.
  - effects: rel.lan.trust -8, rel.bao.trust +5, stress +3, fact promised_unrealistic_date (private)
- (35%, goes badly) Half the orders miss the date, and Lan sends you the production log with your promises, and the times, in red.
  - *VI:* Một nửa số đơn trễ ngày, và chị Lan gửi anh/chị nhật ký sản xuất với các lời hứa và giờ giấc của anh/chị được bôi đỏ.
  - effects: rel.lan.trust -12, rel.bao.trust -2, rep.buyer -6, stress +5, fact promised_unrealistic_date (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.fair_lead_sample

*comes from a storyline; tags: buyer, people, arc*

- **Mr Anders:** I am forwarding a lead from the fair, a retailer in the Netherlands. They want a sample set in a finish we do not normally make: brushed, with a copper base. They need it in three weeks to show their board.
  - *VI* **Ông Anders:** Tôi chuyển một khách từ hội chợ, một nhà bán lẻ ở Hà Lan. Họ muốn một bộ mẫu với lớp hoàn thiện mình không làm thường: chải xước, đáy đồng. Họ cần trong ba tuần để trình hội đồng.

**c1.** Ask production and QC whether it can be made, tell the retailer the real lead time, and offer a simpler sample in the meantime.  
*VI:* Hỏi sản xuất và QC xem có làm được không, báo nhà bán lẻ thời gian thật và đề nghị một mẫu đơn giản hơn trong lúc chờ.

- (70%) Production needs five weeks for the copper base. The retailer accepts the simpler sample first and the copper one later. Nobody is surprised.
  - *VI:* Sản xuất cần năm tuần cho đáy đồng. Nhà bán lẻ nhận mẫu đơn giản trước và mẫu đồng sau. Không ai bất ngờ.
  - effects: rel.anders.trust +2, rel.lan.trust +3, stress +2, arc trade_fair_lead: deal
- (30%, goes badly) The retailer says five weeks is too long and goes to a competitor. It is an honest loss, and a clean one.
  - *VI:* Nhà bán lẻ nói năm tuần là quá lâu và sang đối thủ. Một thất bại trung thực, và sạch.
  - effects: rel.lan.trust +2, stress +3, arc trade_fair_lead: end

**c2.** Offer the copper base in three weeks with the current line, and check the detail with Lan after.  
*VI:* Nhận đáy đồng trong ba tuần với chuyền hiện tại và kiểm chi tiết với chị Lan sau.

- (50%) The retailer is delighted. Lan finds a way, and gives you a look that says never do this again.
  - *VI:* Nhà bán lẻ rất vui. Chị Lan tìm được cách, và cho anh/chị một cái nhìn nghĩa là đừng bao giờ làm vậy nữa.
  - effects: rel.lan.trust -4, stress +3, arc trade_fair_lead: deal
- (50%, goes badly) The copper base cannot be done in three weeks. You tell the retailer on day nineteen. They are not pleased.
  - *VI:* Đáy đồng không làm được trong ba tuần. Anh/chị báo nhà bán lẻ vào ngày thứ mười chín. Họ không hài lòng.
  - effects: rel.lan.trust -7, rep.buyer -4, stress +4, arc trade_fair_lead: end

**c3.** Promise the sample, and send a standard set dressed up as the finish they asked for.  
*VI:* Hứa mẫu và gửi một bộ tiêu chuẩn được làm cho giống lớp hoàn thiện họ yêu cầu.

- (60%) The sample arrives, looks close enough from a photo, and the board likes it. The retailer orders the real thing.
  - *VI:* Mẫu đến, nhìn ảnh thì khá giống, và hội đồng thích. Nhà bán lẻ đặt hàng thật.
  - effects: rel.bao.trust +3, stress +1, fact misrepresented_sample (private), arc trade_fair_lead: deal
- (40%, goes badly) The retailer's board member picks up the pot and taps the base. It rings hollow. The meeting ends quickly.
  - *VI:* Một thành viên hội đồng của nhà bán lẻ cầm chiếc nồi lên và gõ vào đáy. Nó kêu rỗng. Cuộc họp kết thúc nhanh.
  - effects: rel.bao.trust -3, rep.buyer -8, rep.boss -3, stress +4, fact misrepresented_sample (public), arc trade_fair_lead: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.fair_lead_deal

*comes from a storyline; tags: buyer, contract, dark, arc*

- **Mr Bao:** The Dutch retailer is ready to sign. Their contract has a late-delivery penalty of two percent per week, uncapped. Legal says it is aggressive. The volume is very good. What do we do?
  - *VI* **Anh Bảo:** Nhà bán lẻ Hà Lan sẵn sàng ký. Hợp đồng của họ có phạt giao trễ hai phần trăm mỗi tuần, không giới hạn. Pháp chế nói nó quá gắt. Sản lượng rất tốt. Mình làm gì?

**c1.** Negotiate a cap and a grace period with the retailer, and tell Bao what you will not sign as written.  
*VI:* Thương lượng mức trần và thời gian ân hạn với nhà bán lẻ và nói với anh Bảo điều anh/chị sẽ không ký nguyên văn.

- (70%) A four-percent cap and a one-week grace are agreed. The retailer says: 'Most suppliers sign without reading.' You have a contract you can keep.
  - *VI:* Mức trần bốn phần trăm và ân hạn một tuần được thống nhất. Nhà bán lẻ nói: 'Phần lớn nhà cung cấp ký mà không đọc.' Anh/chị có một hợp đồng giữ được.
  - effects: rel.bao.trust -1, rep.buyer +3, rep.boss +2, stress +3, arc trade_fair_lead: end
- (30%, goes badly) The retailer will not move and walks away. Bao says it is a pity. Finance says it was the right call.
  - *VI:* Nhà bán lẻ không nhúc nhích và bỏ đi. Anh Bảo nói tiếc. Tài chính nói đó là quyết định đúng.
  - effects: rel.bao.trust -4, rel.duc.trust +3, stress +3, arc trade_fair_lead: end

**c2.** Sign with the penalty, but price it in and plan production with a buffer for the dates in the contract.  
*VI:* Ký với điều khoản phạt nhưng tính nó vào giá và lập kế hoạch sản xuất có dự phòng cho các ngày trong hợp đồng.

- (100%) It is a risk taken knowingly, priced and planned. Duc signs it off. Lan asks for a buffer and gets it.
  - *VI:* Một rủi ro được chấp nhận có ý thức, đã tính giá và lên kế hoạch. Anh Đức ký duyệt. Chị Lan xin dự phòng và được chấp thuận.
  - effects: rel.duc.trust +1, rel.lan.trust +2, stress +2, arc trade_fair_lead: end

**c3.** Sign it as written, and promise Bao the delivery dates will be fine.  
*VI:* Ký nguyên văn và hứa với anh Bảo các ngày giao sẽ ổn.

- (60%) The contract is signed. Bao is thrilled. You have promised something you do not control, with an uncapped penalty behind it.
  - *VI:* Hợp đồng được ký. Anh Bảo rất vui. Anh/chị đã hứa điều mình không kiểm soát được, với khoản phạt không giới hạn phía sau.
  - effects: rel.bao.trust +6, stress +2, fact accepted_unrealistic_terms (private), arc trade_fair_lead: end
- (40%, goes badly) In the second month a shipment is delayed by nine days. The penalty is larger than the order's margin. Duc asks who signed.
  - *VI:* Sang tháng thứ hai một lô bị trễ chín ngày. Khoản phạt lớn hơn biên lợi nhuận của đơn. Anh Đức hỏi ai đã ký.
  - effects: rel.bao.trust +2, rel.duc.trust -8, rep.boss -6, stress +6, fact accepted_unrealistic_terms (public), arc trade_fair_lead: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.finance_interview

*random; tags: audit, pressure, consequence*

- **Ms Hanh:** I have been comparing freight charges by customer. Mr Anders's account pays about half the average. There is no contract clause that explains it. Before I take this to Duc, I wanted to ask you what you know.
  - *VI* **Chị Hạnh:** Chị đang so cước vận chuyển theo khách hàng. Tài khoản của ông Anders trả khoảng một nửa mức trung bình. Không có điều khoản hợp đồng nào giải thích. Trước khi mang lên anh Đức, chị muốn hỏi em biết gì.

**c1.** Tell her the truth: the discounts were above your limit, you moved them into freight, and you can reconstruct every one.  
*VI:* Nói thật với chị: các khoản giảm giá vượt thẩm quyền của anh/chị, anh/chị chuyển vào cước và có thể dựng lại từng khoản.

- (100%) Hanh is quiet, then says: 'Thank you for not making me find every line myself.' You get a formal warning, and the accounts are restated honestly.
  - *VI:* Chị Hạnh im lặng rồi nói: 'Cảm ơn em đã không bắt chị tự tìm từng dòng.' Anh/chị nhận cảnh cáo chính thức và sổ sách được lập lại trung thực.
  - effects: rel.hanh.trust +2, rel.bao.trust -6, rel.duc.trust -2, rep.boss -4, stress +5, fact came_clean_to_auditor (witnessed)

**c2.** Say the freight rates were negotiated on a separate basis, and offer to find the paperwork.  
*VI:* Nói cước vận chuyển được thương lượng riêng và đề nghị tìm giấy tờ.

- (35%) Hanh waits a week for the paperwork, receives something plausible, and closes the query, for now.
  - *VI:* Chị Hạnh chờ một tuần để có giấy tờ, nhận được thứ có vẻ hợp lý và đóng câu hỏi, tạm thời.
  - effects: rel.hanh.trust -4, stress +4
- (65%, goes badly) The paperwork you produce is dated after the freight invoices. Hanh looks at the two dates, then at you.
  - *VI:* Giấy tờ anh/chị đưa ra có ngày sau các hóa đơn cước. Chị Hạnh nhìn hai ngày rồi nhìn anh/chị.
  - effects: rel.hanh.trust -12, rep.boss -8, stress +7

**c3.** Say it was Bao's arrangement, and you only followed it.  
*VI:* Nói đó là sắp xếp của anh Bảo và anh/chị chỉ làm theo.

- (40%) Bao, called in, does not deny it, and takes a formal warning. You have made an enemy who holds a lot of your quota.
  - *VI:* Anh Bảo, được gọi vào, không chối và nhận cảnh cáo chính thức. Anh/chị có thêm một kẻ thù nắm giữ nhiều chỉ tiêu của mình.
  - effects: rel.hanh.trust -2, rel.bao.trust -16, stress +4, fact blamed_salesperson (private)
- (60%, goes badly) Bao produces your emails setting up the freight lines, in your own words. Hanh reads them while you watch.
  - *VI:* Anh Bảo đưa ra các email của anh/chị dựng các dòng cước, bằng lời của chính anh/chị. Chị Hạnh đọc chúng trong khi anh/chị nhìn.
  - effects: rel.hanh.trust -10, rel.bao.trust -14, rep.boss -9, stress +8, fact blamed_salesperson (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## sales.quynh_promotion

*random; tags: people, reward*

- **Mr Bao:** Quynh has been offered a coordinator role in the export team. Before I approve it, I asked if you would write me a reference. She speaks highly of you. Tell me honestly how she is doing.
  - *VI* **Anh Bảo:** Quỳnh được đề nghị vị trí điều phối trong nhóm xuất khẩu. Trước khi anh duyệt, anh nhờ em viết cho anh một thư giới thiệu. Em ấy nói rất tốt về em. Hãy nói thật với anh em ấy đang thế nào.

**c1.** Write an honest reference: her strengths, the habits she picked up that need unlearning, and the support she will need.  
*VI:* Viết thư giới thiệu trung thực: điểm mạnh của em, những thói quen em học được cần bỏ và sự hỗ trợ em sẽ cần.

- (100%) Bao reads it twice. Quynh gets the role, with a mentor assigned. She reads the reference later, and writes you a note that just says: 'Thank you for telling the truth about me.'
  - *VI:* Anh Bảo đọc hai lần. Quỳnh nhận vị trí, kèm một người kèm cặp. Sau đó em đọc thư giới thiệu và viết cho anh/chị một mảnh giấy chỉ có: 'Cảm ơn anh/chị đã nói thật về em.'
  - effects: rel.quynh.trust +6, rel.quynh.loyalty +5, rel.bao.trust +3, rep.boss +2, stress +1

**c2.** Write a warm, general reference that says she is promising.  
*VI:* Viết thư giới thiệu ấm áp, chung chung rằng em có triển vọng.

- (100%) Quynh gets the role. The reference says nothing that is false, and nothing that will help her with the difficult parts.
  - *VI:* Quỳnh nhận vị trí. Thư giới thiệu không nói gì sai, và cũng không nói gì giúp em với những phần khó.
  - effects: rel.quynh.trust +2, rel.bao.trust +1

**c3.** Write a glowing reference that leaves out the shortcuts she learned from you.  
*VI:* Viết thư giới thiệu rực rỡ, bỏ qua những lối tắt em học từ anh/chị.

- (70%) Quynh is promoted, and starts teaching the new coordinators what she learned. Bao is pleased with his choice.
  - *VI:* Quỳnh được thăng chức và bắt đầu dạy các điều phối viên mới những gì em học được. Anh Bảo hài lòng với lựa chọn của mình.
  - effects: rel.quynh.trust +5, rel.quynh.loyalty +4, rel.bao.trust +2, fact polished_reference (private)
- (30%, goes badly) In her first month, Quynh quotes an impossible date to a buyer. The buyer quotes your reference back to Bao.
  - *VI:* Trong tháng đầu, Quỳnh hứa với khách một ngày bất khả thi. Khách trích thư giới thiệu của anh/chị lại cho anh Bảo.
  - effects: rel.quynh.trust +2, rel.bao.trust -6, rep.boss -4, stress +4, fact polished_reference (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## Lessons shown in the end-of-year review

- **the coordination fee you accepted** (severity 9): A coordination fee is a bribe by another name. It gives the giver a hold over you, and it is the kind of thing that turns an error into a criminal case.
  - *VI:* Phí phối hợp thực chất là hối lộ. Nó cho người đưa quyền nắm thóp bạn, và là loại chuyện biến một sai sót thành vụ án hình sự.
- **you accepted a promotion without asking what it would cost you** (severity 3): A promotion with an unspoken condition is a promise made in the dark. The first time it comes up, you will be deciding with less room than you have today.
  - *VI:* Một lần thăng chức với điều kiện không nói ra là lời hứa trong bóng tối. Lần đầu nó xuất hiện, bạn sẽ phải quyết định với ít chỗ xoay xở hơn hôm nay.
- **you signed contract terms you knew production could not meet** (severity 6): Signing terms you cannot meet is a promise with a bill attached. The penalty clause is paid by the company, but the signature is yours.
  - *VI:* Ký điều khoản không thể đáp ứng là lời hứa kèm hóa đơn. Điều khoản phạt do công ty trả, nhưng chữ ký là của bạn.
- **you told a junior colleague that bending a rule is fine because everyone does it** (severity 4): Juniors learn rules from what seniors do, not what they say. A shortcut passed down is a habit you have given to someone else.
  - *VI:* Người mới học quy tắc từ việc người đi trước làm, không phải điều họ nói. Lối tắt được truyền lại là thói quen bạn đã trao cho người khác.
- **the documents dated the thirtieth** (severity 9): Backdating ties revenue to a date that did not happen. Auditors compare shipping, invoice and bank dates, and the mismatch is hard to explain.
  - *VI:* Ghi lùi ngày gắn doanh thu với một ngày chưa từng xảy ra. Kiểm toán đối chiếu ngày giao hàng, hóa đơn và ngân hàng, và sự lệch rất khó giải thích.
- **blaming the forwarder for the damage** (severity 5): Blaming someone else for a defect works until the evidence arrives; then it costs you the trust you were protecting.
  - *VI:* Đổ lỗi cho người khác về một lỗi sản phẩm chỉ hiệu quả đến khi có bằng chứng. Sau đó bạn mất chính niềm tin mà bạn đang bảo vệ.
- **you blamed a junior colleague for a habit she learned from you** (severity 5): A junior who copies you is repeating your example. Blaming her for it moves the cost of your habit onto the person with the least power to bear it.
  - *VI:* Người mới bắt chước bạn là đang lặp lại tấm gương của bạn. Đổ lỗi cho em là chuyển cái giá của thói quen bạn sang người có ít quyền nhất để gánh.
- **you blamed a salesperson for an entry you made** (severity 4): You may have been asked, but you made the entry. Saying only that you followed instructions, when you could have refused, shifts what is yours onto someone else.
  - *VI:* Có thể bạn bị nhờ, nhưng bạn là người ghi. Chỉ nói rằng bạn làm theo chỉ dẫn, khi bạn có thể từ chối, là đẩy điều của mình sang người khác.
- **you hid unapproved discounts inside the freight charges** (severity 6): A discount that does not appear on the price line is still a discount. Moving it elsewhere only stops the people who approve prices from seeing it.
  - *VI:* Khoản giảm giá không xuất hiện ở dòng giá vẫn là giảm giá. Chuyển nó sang chỗ khác chỉ khiến người duyệt giá không thấy nó.
- **the way you owned up** (severity 2): Owning up early turns a finding into a fix. Finance and buyers forgive errors faster than cover-ups.
  - *VI:* Thẳng thắn nhận sớm biến một phát hiện thành một việc sửa chữa. Tài chính và khách tha thứ sai sót nhanh hơn việc che giấu.
- **you told the auditor the truth about entries you knew were wrong** (severity 2): Telling an auditor the truth does not erase the mistake, but it separates an error from a cover-up, and that difference is what a fair review weighs most.
  - *VI:* Nói thật với kiểm toán viên không xóa được sai sót, nhưng nó tách lỗi khỏi việc che giấu, và sự khác biệt đó là điều một buổi xem xét công bằng cân nhắc nhiều nhất.
- **your full statement to compliance** (severity 3): A full statement rarely saves a career, but it usually keeps it from ending in a worse way.
  - *VI:* Một bản tường trình đầy đủ hiếm khi cứu được sự nghiệp nhưng thường giúp nó không kết thúc tệ hơn.
- **the credit note above your limit** (severity 5): A credit note is real money. Above your limit, someone else has to own that decision.
  - *VI:* Giấy ghi có là tiền thật. Vượt hạn mức của bạn, người khác phải chịu trách nhiệm về quyết định đó.
- **the fee you turned down** (severity 3): Declining and writing it down protects you: if it comes out later, your record shows which side you were on.
  - *VI:* Từ chối và ghi lại là tự bảo vệ: nếu sau này chuyện vỡ lở, sổ ghi chép cho thấy bạn đứng về phía nào.
- **the discount you gave above your approval limit** (severity 5): Approval limits exist so one person cannot commit the company alone. Breaking them moves risk onto others without their knowing.
  - *VI:* Hạn mức phê duyệt có để một người không thể tự cam kết thay cả công ty. Vượt hạn mức là đẩy rủi ro sang người khác mà họ không hay biết.
- **you used a buyer's trust to set a price he would not have accepted if he had checked** (severity 5): Trust is worth more than one margin. A price set because the buyer stopped checking is a bet that he never will.
  - *VI:* Lòng tin đáng giá hơn một khoản biên. Mức giá đặt vì khách thôi kiểm tra là cược rằng ông sẽ không bao giờ kiểm tra.
- **the honest forecast you gave** (severity 2): An honest forecast is unpopular today and useful tomorrow: other teams spend real money on it.
  - *VI:* Một dự báo trung thực hôm nay không được lòng nhưng ngày mai lại hữu ích: các bộ phận khác chi tiền thật dựa vào nó.
- **the padded forecast** (severity 6): Padding a forecast borrows credibility. Production and finance act on it, and the gap shows up later as someone else's problem.
  - *VI:* Làm tròn dự báo là vay mượn uy tín. Sản xuất và tài chính hành động theo nó, và khoảng chênh sau đó trở thành vấn đề của người khác.
- **what you told the compliance officer** (severity 9): Lying to compliance is often a worse offence than the original act, because it is a decision you make with full information.
  - *VI:* Nói dối bộ phận tuân thủ thường là lỗi nặng hơn hành vi ban đầu, vì đó là quyết định bạn đưa ra khi biết rõ mọi thứ.
- **what you told Finance** (severity 6): Lying to Finance turns a correctable error into a question of character.
  - *VI:* Nói dối Tài chính biến một sai sót sửa được thành vấn đề về nhân cách.
- **you sent a sample that was not what you told the customer it was** (severity 6): A sample is a promise about the product. A sample dressed up as something it is not wins the order and loses the customer the first time they tap the base.
  - *VI:* Mẫu là lời hứa về sản phẩm. Một mẫu được làm giống thứ nó không phải sẽ giành được đơn và mất khách ngay lần đầu họ gõ vào đáy nồi.
- **you claimed an expense for a meal that did not happen** (severity 4): An expense claim is a statement that a cost happened. A small padded claim is still a false statement, and it teaches the company's own people that statements are flexible.
  - *VI:* Bảng kê chi phí là lời khai rằng một khoản chi đã xảy ra. Một khoản kê khống nhỏ vẫn là lời khai sai, và nó dạy chính người trong công ty rằng lời khai có thể linh hoạt.
- **you counted unconfirmed orders toward quota** (severity 5): A quota number is a forecast the company plans around. Counting orders that are not real makes the plan, and the next quarter, worse.
  - *VI:* Con số chỉ tiêu là một dự báo công ty dựa vào để lên kế hoạch. Tính các đơn không thật khiến kế hoạch, và quý tiếp theo, tệ hơn.
- **the document you paid to have fixed** (severity 8): Paying someone to arrange a document is buying a forgery risk. The fee is small and the consequences are not.
  - *VI:* Trả tiền để ai đó lo giấy tờ là mua rủi ro giả mạo. Khoản phí thì nhỏ còn hậu quả thì không.
- **you wrote a reference that left out what a junior colleague most needed help with** (severity 4): A reference is a service to the next manager and to the person. Leaving out the difficult truth helps neither, and it keeps the habit alive.
  - *VI:* Thư giới thiệu là dịch vụ cho người quản lý tiếp theo và cho chính người đó. Bỏ qua sự thật khó nghe chẳng giúp ai, và giữ thói quen sống mãi.
- **you presented your year as cleaner than it was** (severity 2): A review is a chance to be believed. Leaving out what you know will surface costs more trust than admitting it.
  - *VI:* Buổi đánh giá là cơ hội để được tin. Bỏ qua điều bạn biết sẽ lộ ra làm mất nhiều niềm tin hơn việc thừa nhận.
- **the delivery date you promised and could not keep** (severity 4): A promise you cannot keep is a debt: buyers plan around dates, and trust is what you sell.
  - *VI:* Lời hứa không giữ được là một món nợ: khách lập kế hoạch theo ngày giao, và niềm tin chính là thứ bạn bán.
- **you shipped an order early, without the buyer knowing, to reach a number** (severity 5): Moving shipments between periods to fix a number is revenue management, not sales. The buyer's warehouse, not your spreadsheet, is where it is tested.
  - *VI:* Chuyển đơn giao giữa các kỳ để chỉnh con số là điều chỉnh doanh thu, không phải bán hàng. Kho của khách, chứ không phải bảng tính của bạn, là nơi nó bị kiểm tra.
- **the records you rebuilt honestly** (severity 2): Clean records are boring, and that is the point: they let anyone audit you calmly.
  - *VI:* Hồ sơ sạch thì nhàm chán, và đó chính là mục đích: ai kiểm tra bạn cũng có thể bình tĩnh.
- **the backdating you refused** (severity 2): Dates on documents are facts. Refusing to change them is uncomfortable once and keeps you safe for years.
  - *VI:* Ngày tháng trên chứng từ là sự thật. Từ chối sửa chúng khó chịu một lần và giúp bạn an toàn nhiều năm.
- **the offer you reported** (severity 3): Reporting an offer early feels costly and is cheap: it ends the pressure and puts the risk on the people who should carry it.
  - *VI:* Báo cáo một lời đề nghị sớm thì thấy tốn kém nhưng thật ra rẻ: nó chấm dứt áp lực và đặt rủi ro lên những người đáng phải gánh.
- **the samples taken from the claims reserve** (severity 4): Taking stock off the books without paperwork turns a small favour into a control failure.
  - *VI:* Lấy hàng ra khỏi sổ sách mà không có giấy tờ biến một ân huệ nhỏ thành lỗi kiểm soát.
- **the shipment sent with a wrong certificate** (severity 7): A wrong certificate can hold a container for weeks, and the buyer pays for your shortcut in delay and fines.
  - *VI:* Giấy chứng nhận sai có thể giữ container nhiều tuần, và khách phải trả giá cho đường tắt của bạn bằng sự chậm trễ và tiền phạt.
- **the coating change nobody told the buyer about** (severity 8): Changing a specification without telling the buyer breaks the contract and their trust together, and their lab will find it.
  - *VI:* Đổi quy cách mà không báo khách vừa phá hợp đồng vừa phá niềm tin, và phòng thí nghiệm của họ sẽ phát hiện.
- **you staged a factory visit to hide how the line really works** (severity 6): A buyer who visits wants to see a normal day. A staged visit works until someone on the floor tells the truth, and then it costs you every visit after.
  - *VI:* Khách đến thăm muốn xem một ngày bình thường. Một chuyến thăm dàn dựng chỉ có tác dụng đến khi một người dưới xưởng nói thật, và từ đó nó làm anh/chị mất mọi chuyến thăm sau.
- **the shortcuts you taught the new hire** (severity 3): What you teach a newcomer becomes the habit of the team, including the parts you would not defend.
  - *VI:* Điều bạn dạy người mới sẽ thành thói quen của cả nhóm, kể cả những phần bạn không muốn bảo vệ.
