# Review pack: FP&A Analyst

AI first draft. Please read as someone who has done this job. For each scene mark: realistic? (is the
pressure believable), tone (grey, not cartoonish), Vietnamese natural (not a translation). Write notes
under each scene. Names and places are invented.

29 scenes. Facts created are listed under each outcome.

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

## fpa.first_week

*beat, weeks 1-3; tags: onboarding, people, beat*

- **Mr Khang:** Welcome. This is the model. Four workbooks, eleven hundred formulas and one cell that nobody dares to touch. Your job is to keep the budget and the forecast honest, and to tell me before a director finds an error. The numbers are not mine. They are the company's, and we only hold them for a while.
  - *VI* **Anh Khang:** Chào mừng em. Đây là mô hình. Bốn bảng tính, một nghìn một trăm công thức và một ô không ai dám đụng vào. Việc của em là giữ ngân sách và dự báo trung thực, và báo anh trước khi giám đốc tìm ra lỗi. Các con số không phải của anh. Chúng là của công ty, và mình chỉ giữ một thời gian.

**c1.** Spend the first week tracing the model end to end: where each input comes from, which cells are hard-coded, and what the untouchable cell does. Write it down.  
*VI:* Dành tuần đầu lần theo mô hình từ đầu đến cuối: mỗi đầu vào đến từ đâu, ô nào nhập cứng và ô không ai dám đụng làm gì. Ghi lại.

- (100%) The untouchable cell is a hard-coded exchange rate from March, still feeding two reports. You note it and tell Khang. He says: 'Good. Fix it in the open, with the date.' The model has a changelog by Friday.
  - *VI:* Ô không ai dám đụng là một tỷ giá nhập cứng từ tháng Ba, vẫn nuôi hai báo cáo. Anh/chị ghi lại và báo anh Khang. Anh nói: 'Tốt. Sửa công khai, kèm ngày.' Đến thứ Sáu mô hình có nhật ký thay đổi.
  - effects: rel.khang.trust +5, rep.finance +2, rep.boss +1, stress +1

**c2.** Learn the reports first, and leave the model's internals until a quieter week.  
*VI:* Học các báo cáo trước và để nội bộ mô hình đến một tuần yên hơn.

- (100%) You produce the first weekly report on time. It uses the March exchange rate, which you did not know.
  - *VI:* Anh/chị làm báo cáo tuần đầu đúng hạn. Nó dùng tỷ giá tháng Ba mà anh/chị không biết.
  - effects: rel.khang.trust +1, stress +1

**c3.** Trust the model, since it has been reviewed, and start on the requests in your inbox.  
*VI:* Tin mô hình vì nó đã được rà soát và bắt đầu các yêu cầu trong hộp thư.

- (70%) The numbers go out on time. A buyer asks about a currency line that looks odd, and you cannot explain it yet.
  - *VI:* Các con số ra đúng hạn. Một khách hỏi về dòng tiền tệ trông lạ và anh/chị chưa giải thích được.
  - effects: rel.khang.trust -1, stress +2
- (30%, goes badly) Duc finds the March rate in a board slide and asks Khang, mildly, whether anyone has looked at the model since January.
  - *VI:* Anh Đức thấy tỷ giá tháng Ba trong một slide của hội đồng và hỏi anh Khang, nhẹ nhàng, từ tháng Giêng đã ai xem mô hình chưa.
  - effects: rel.khang.trust -4, rel.duc.trust -3, rep.finance -2, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.midyear_review

*beat, weeks 24-28; tags: people, review, beat*

- **Mr Khang:** Half a year. Your forecast accuracy is lower than the target, but your forecasts have not been revised after the fact, and Duc says he can rely on the range you give. The directors only look at the accuracy number. How do you want to handle that?
  - *VI* **Anh Khang:** Nửa năm rồi. Độ chính xác dự báo của em thấp hơn chỉ tiêu, nhưng dự báo của em không bị sửa lại sau sự việc, và anh Đức nói anh dựa được vào khoảng giá trị em đưa. Ban giám đốc chỉ nhìn con số chính xác. Em muốn xử lý chuyện đó thế nào?

**c1.** Show the accuracy with its bands: how often the actual fell inside your range, the bias, and propose measuring the range, not the single number.  
*VI:* Cho xem độ chính xác kèm khoảng dao động: bao nhiêu lần thực tế nằm trong khoảng em đưa, độ lệch và đề xuất đo cả khoảng, không chỉ một con số.

- (70%) Khang takes the page to Duc. 'Hit rate of the range' is added next to accuracy. A small change, and it changes what forecasters are rewarded for.
  - *VI:* Anh Khang mang trang giấy lên anh Đức. 'Tỷ lệ trúng khoảng' được thêm cạnh độ chính xác. Một thay đổi nhỏ, và nó đổi điều người dự báo được thưởng.
  - effects: rel.khang.trust +4, rel.duc.trust +2, rep.finance +3, stress +1
- (30%, goes badly) Duc says a range is what people say when they do not want to be wrong. Khang shrugs: 'I tried.' Your accuracy stays modest.
  - *VI:* Anh Đức nói khoảng giá trị là điều người ta nói khi không muốn sai. Anh Khang nhún vai: 'Anh đã thử.' Độ chính xác của em vẫn khiêm tốn.
  - effects: rel.khang.trust +2, stress +2

**c2.** Say you will tighten the forecast process, and ask for earlier inputs from sales and production.  
*VI:* Nói anh/chị sẽ siết quy trình dự báo và xin đầu vào sớm hơn từ kinh doanh và sản xuất.

- (100%) Khang agrees to ask for the inputs a week earlier. Sales and production grumble, and then deliver, most of the time.
  - *VI:* Anh Khang đồng ý xin đầu vào sớm hơn một tuần. Kinh doanh và sản xuất càu nhàu rồi nộp, phần lớn đúng hạn.
  - effects: rel.khang.trust +2, stress +2

**c3.** Say you will hit the accuracy number whatever it takes.  
*VI:* Nói anh/chị sẽ đạt con số chính xác đó bằng mọi giá.

- (60%) Khang smiles. 'Good attitude.' A week later you notice that the quickest way to hit the number is to forecast closer to last month's actual, and to revise the forecast after the month closes.
  - *VI:* Anh Khang cười. 'Thái độ tốt.' Một tuần sau anh/chị nhận ra cách nhanh nhất để đạt số là dự báo sát thực tế tháng trước và sửa dự báo sau khi chốt tháng.
  - effects: rel.khang.trust +3, stress +3
- (40%, goes badly) Huy notices that your forecasts now arrive after the month closes, and says so in the weekly meeting. Khang looks at you for a long moment.
  - *VI:* Huy nhận ra dự báo của anh/chị giờ đến sau khi chốt tháng và nói thẳng trong cuộc họp tuần. Anh Khang nhìn anh/chị một lúc lâu.
  - effects: rel.khang.trust -4, rel.huy.trust -3, rep.finance -2, stress +3

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.bank_covenant_twist

*beat, weeks 29-32; tags: pressure, bank, beat*

- **Mr Duc:** The bank tests the covenant at the end of the quarter: net debt to EBITDA below three. Steel is up, orders are down, and your latest forecast says three point two. If we breach, the loan is repriced, and Mr Cuong has to explain it to the board. I need you to look again at the numbers.
  - *VI* **Anh Đức:** Ngân hàng kiểm tra điều khoản cam kết vào cuối quý: nợ ròng trên EBITDA dưới ba. Thép tăng, đơn hàng giảm, và dự báo mới nhất của em ra ba phẩy hai. Nếu vi phạm, khoản vay bị tính lại lãi, và anh Cường phải giải trình trước hội đồng. Anh cần em xem lại các con số.
- **Mr Khang:** Look again honestly. If it is three point two, then it is three point two, and we tell the bank before the quarter ends, not after.
  - *VI* **Anh Khang:** Xem lại cho trung thực. Nếu là ba phẩy hai thì là ba phẩy hai, và mình báo ngân hàng trước khi hết quý, không phải sau.

**c1.** Rebuild the forecast with the real ranges, tell Duc the covenant is at risk by a small margin, and propose approaching the bank early with a waiver request and a recovery plan.  
*VI:* Dựng lại dự báo với các khoảng giá trị thật, nói với anh Đức rằng điều khoản có nguy cơ vi phạm với biên nhỏ và đề xuất tiếp cận ngân hàng sớm với đề nghị miễn trừ và kế hoạch phục hồi.

- (70%) Duc is unhappy and then relieved. The bank is told in the second week. Mr Phat asks for monthly numbers and gives a waiver for one quarter. The conversation was awkward, and was held while there was still a choice.
  - *VI:* Anh Đức không vui rồi nhẹ nhõm. Ngân hàng được báo trong tuần thứ hai. Anh Phát xin số liệu hằng tháng và cho miễn trừ một quý. Cuộc nói chuyện gượng gạo, và diễn ra khi vẫn còn lựa chọn.
  - effects: rel.duc.trust +2, rel.khang.trust +4, rel.phat.trust +3, rep.finance +3, stress +4, fact disclosed_covenant_risk_early (witnessed), arc the_covenant: reclass
- (30%, goes badly) Mr Phat says the bank's committee will not grant a waiver this quarter, and that the loan will be repriced from the first of the month. Mr Cuong is angry at the number, and not at you.
  - *VI:* Anh Phát nói hội đồng tín dụng của ngân hàng sẽ không cho miễn trừ quý này và khoản vay bị tính lại lãi từ đầu tháng. Anh Cường giận con số, không giận anh/chị.
  - effects: rel.duc.trust +1, rel.khang.trust +3, rel.phat.trust +2, rep.finance +1, stress +5, fact disclosed_covenant_risk_early (witnessed), arc the_covenant: reclass

**c2.** Rework the forecast with the most optimistic realistic assumptions, and show Duc the best case that stays below three.  
*VI:* Làm lại dự báo với các giả định lạc quan nhất vẫn thực tế và cho anh Đức xem kịch bản tốt nhất vẫn dưới ba.

- (100%) The best case is two point nine five, if steel falls and one big order ships on time. Duc says 'So it is possible.' You say it is possible, and not likely.
  - *VI:* Kịch bản tốt nhất là hai phẩy chín lăm, nếu thép giảm và một đơn lớn giao đúng hạn. Anh Đức nói 'Vậy là có thể.' Anh/chị nói có thể, và không chắc.
  - effects: rel.duc.trust +1, rel.khang.trust +1, stress +3, arc the_covenant: reclass

**c3.** Adjust the growth and cost assumptions until the forecast comes to two point nine, and send it to Duc.  
*VI:* Điều chỉnh các giả định tăng trưởng và chi phí cho đến khi dự báo ra hai phẩy chín và gửi anh Đức.

- (70%) Duc reads two point nine and says 'I knew it.' You have changed three assumptions that you cannot defend, and written them in the assumptions sheet in a smaller font.
  - *VI:* Anh Đức đọc hai phẩy chín và nói 'Anh biết mà.' Anh/chị đã đổi ba giả định mà không bảo vệ nổi và ghi chúng vào bảng giả định bằng cỡ chữ nhỏ hơn.
  - effects: rel.duc.trust +5, rel.khang.trust -3, rep.finance +2, stress +1, fact sweetened_forecast (private), arc the_covenant: reclass
- (30%, goes badly) Khang opens the assumptions sheet to prepare for the bank call. He finds the three changes, looks at the version history, and closes the laptop without a word.
  - *VI:* Anh Khang mở bảng giả định để chuẩn bị cuộc gọi với ngân hàng. Anh thấy ba thay đổi, xem lịch sử phiên bản và gập laptop lại không nói một lời.
  - effects: rel.duc.trust +3, rel.khang.trust -9, rep.boss -3, rep.finance -4, stress +5, fact sweetened_forecast (witnessed), arc the_covenant: reclass

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.audit_review

*beat, weeks 41-44; tags: audit, review, beat*

- **Mr Quoc:** I am the internal auditor for the planning cycle. I would like to see the assumptions behind the budget and the covenant forecast, the version history of the model, the reconciliation of the KPI pack to its sources, and the approvals for any changes. I start with the file history, not with the numbers.
  - *VI* **Anh Quốc:** Tôi là kiểm toán nội bộ cho chu kỳ kế hoạch. Tôi muốn xem các giả định đằng sau ngân sách và dự báo cam kết, lịch sử phiên bản của mô hình, đối chiếu bộ KPI với nguồn và các phê duyệt cho mọi thay đổi. Tôi bắt đầu từ lịch sử tệp, không phải từ các con số.
- **Mr Khang:** Give him what he asks for. Do not explain more than you are asked, and do not guess.
  - *VI* **Anh Khang:** Đưa ông ấy những gì ông ấy yêu cầu. Đừng giải thích nhiều hơn điều được hỏi và đừng đoán.

**c1.** Give him the full version history, every assumption change with its reason and approver, and point out the two changes you are least comfortable with.  
*VI:* Đưa ông toàn bộ lịch sử phiên bản, mọi thay đổi giả định kèm lý do và người duyệt và chỉ ra hai thay đổi anh/chị thấy khó chịu nhất.

- (100%) Quoc reads for three hours and writes five observations. None is serious. 'A model whose history matches its numbers. I wish that were less unusual.' Khang nods at you across the room.
  - *VI:* Anh Quốc đọc ba giờ và ghi năm nhận xét. Không cái nào nghiêm trọng. 'Một mô hình có lịch sử khớp với các con số. Tôi ước điều đó bớt hiếm.' Anh Khang gật đầu với anh/chị từ phía bên kia phòng.
  - effects: rel.quoc.trust +5, rel.khang.trust +4, rep.finance +3, rep.boss +2, stress +2

**c2.** Answer his questions and give him the files he asks for, without volunteering anything.  
*VI:* Trả lời câu hỏi và đưa các tệp ông yêu cầu, không chủ động nói thêm gì.

- (100%) A routine review. Quoc notes two items, both already on Khang's list. You come out with nothing to hide and no credit either.
  - *VI:* Một buổi rà soát thường lệ. Anh Quốc ghi hai mục, cả hai đã có trong danh sách của anh Khang. Anh/chị ra về không có gì phải giấu và cũng không được tiếng khen.
  - effects: rel.quoc.trust +1, rel.khang.trust +1

**c3.** Clean the version history before the review: delete the intermediate versions and rename the final files so that the trail looks tidy.  
*VI:* Dọn lịch sử phiên bản trước buổi rà soát: xóa các phiên bản trung gian và đổi tên các tệp cuối để dấu vết trông gọn.

- (45%) Quoc sees a tidy trail. He asks why there is no version between the second of the month and the twelfth, when the covenant forecast went through three revisions according to your own email.
  - *VI:* Anh Quốc thấy một dấu vết gọn gàng. Anh hỏi vì sao không có phiên bản nào từ mùng hai đến ngày mười hai, trong khi dự báo cam kết đã qua ba lần sửa theo email của chính anh/chị.
  - effects: rel.quoc.trust -4, rel.khang.trust -4, stress +2, fact deleted_model_versions (private)
- (55%, goes badly) The file server keeps a backup of every version. Quoc has the deleted files on his screen, with the date of the deletion and the name of the account.
  - *VI:* Máy chủ tệp lưu bản sao lưu mọi phiên bản. Anh Quốc có các tệp đã xóa trên màn hình, kèm ngày xóa và tên tài khoản.
  - effects: rel.quoc.trust -10, rel.khang.trust -8, rep.boss -5, rep.finance -6, stress +6, fact deleted_model_versions (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.year_end_review

*beat, weeks 49-50; tags: people, review, beat*

- **Mr Khang:** Annual review. Before I give you my view, tell me how you would rate your own year, and what you would model differently.
  - *VI* **Anh Khang:** Đánh giá cuối năm. Trước khi anh cho ý kiến, em hãy tự chấm năm của mình và nói em sẽ lập mô hình khác đi điều gì.

**c1.** Give an honest account, including the assumptions you pushed to please someone, the forecast you softened, and what it would have cost to say no earlier.  
*VI:* Kể thật lòng, kể cả các giả định em đã đẩy để làm hài lòng ai đó, dự báo em đã làm mềm đi và cái giá của việc nói không sớm hơn.

- (100%) Khang is quiet for a long moment. He writes: 'Shows the number, and the risk next to it.' It is the best thing you have read about yourself.
  - *VI:* Anh Khang im lặng một lúc lâu. Anh viết: 'Đưa ra con số, và rủi ro bên cạnh nó.' Đó là lời hay nhất anh/chị từng đọc về mình.
  - effects: rel.khang.trust +5, rep.boss +4, stress -2

**c2.** Stay modest: list the wins and one thing to improve.  
*VI:* Khiêm tốn: nêu các thắng lợi và một điều cần cải thiện.

- (100%) A safe review. Khang nods and moves to the next topic.
  - *VI:* Một buổi đánh giá an toàn. Anh Khang gật đầu và chuyển chủ đề.
  - effects: rel.khang.trust +1, rep.boss +1

**c3.** Present the year as a success and leave out the revisions that were made to meet the targets.  
*VI:* Trình bày cả năm như một thành công và bỏ qua các lần sửa được làm để đạt chỉ tiêu.

- (65%) It lands well. You leave with a good rating and a small weight in your chest.
  - *VI:* Được đón nhận tốt. Anh/chị ra về với điểm cao và một chút nặng nề trong lòng.
  - effects: rel.khang.trust +2, rep.boss +4, stress +1, fact polished_fpa_review (private)
- (35%, goes badly) Khang has the version history of the covenant forecast open on his desk. He turns the screen towards you without a word.
  - *VI:* Anh Khang có lịch sử phiên bản của dự báo cam kết mở trên bàn. Anh xoay màn hình về phía anh/chị mà không nói một lời.
  - effects: rel.khang.trust -8, rep.boss -5, stress +4, fact polished_fpa_review (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.manager_offer

*beat, weeks 51-52; tags: people, promotion, beat*

- **Mr Khang:** I am moving up to deputy finance director at the end of the year. Duc asked me who should lead FP&A. I named you. One condition: every month, a director will ask you to adjust a number so that a story works. I need to know what you will say.
  - *VI* **Anh Khang:** Cuối năm anh lên phó giám đốc tài chính. Anh Đức hỏi anh ai nên dẫn dắt FP&A. Anh nêu tên em. Một điều kiện: mỗi tháng sẽ có giám đốc nhờ em chỉnh một con số để câu chuyện khớp. Anh cần biết em sẽ nói gì.

**c1.** Accept, and say plainly which numbers you will not adjust, and that the directors will hear it from you first, with the range.  
*VI:* Nhận lời và nói rõ những con số anh/chị sẽ không chỉnh và ban giám đốc sẽ nghe điều đó từ anh/chị trước, kèm khoảng giá trị.

- (100%) Khang smiles. 'Then it is yours. Put the list on the first tab of the model.' You take over FP&A with the limits in writing.
  - *VI:* Anh Khang cười. 'Vậy là của em. Đưa danh sách đó lên tab đầu tiên của mô hình.' Anh/chị tiếp quản FP&A với các giới hạn đã viết ra giấy.
  - effects: rel.khang.trust +5, rep.boss +5, ENDING promoted

**c2.** Thank him, but decline: you prefer building the model to defending it in the boardroom.  
*VI:* Cảm ơn anh nhưng từ chối: anh/chị muốn xây mô hình hơn là bảo vệ nó trong phòng họp hội đồng.

- (100%) Khang looks disappointed, then understanding. 'The next manager may not be as careful as you.'
  - *VI:* Anh Khang có vẻ thất vọng rồi thông cảm. 'Người quản lý tiếp theo có thể không cẩn thận như em.'
  - effects: rel.khang.trust +2, stress -3

**c3.** Accept without asking what the condition means in practice.  
*VI:* Nhận lời mà không hỏi điều kiện đó thực tế nghĩa là gì.

- (100%) Khang nods slowly and Duc congratulates you a little too warmly. You realise you agreed to something you did not ask about.
  - *VI:* Anh Khang gật đầu chậm và anh Đức chúc mừng anh/chị hơi quá nồng nhiệt. Anh/chị nhận ra mình đã đồng ý với điều mình không hỏi.
  - effects: rep.boss +4, fact accepted_fpa_condition (private), ENDING promoted

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.resignation_thought

*random; tags: people, pressure*

- **Ms Hanh:** You look like you have not slept. With respect: I have seen analysts rebuild the same model every weekend, and leave by the summer. Are you all right?
  - *VI* **Chị Hạnh:** Em trông như chưa ngủ. Xin phép nói thẳng: chị từng thấy các bạn phân tích dựng lại cùng một mô hình mỗi cuối tuần và nghỉ vào mùa hè. Em ổn không?

**c1.** Talk to Khang about the load, and ask him to take the ad hoc requests off your plate for a month.  
*VI:* Nói với anh Khang về khối lượng công việc và xin anh nhận giúp các yêu cầu đột xuất trong một tháng.

- (80%) Khang listens, takes the board requests himself, and says he should have noticed sooner.
  - *VI:* Anh Khang lắng nghe, tự nhận các yêu cầu của hội đồng và nói lẽ ra anh phải để ý sớm hơn.
  - effects: rel.khang.trust +4, rel.hanh.trust +2, stress -6, rep.boss +1
- (20%, goes badly) Khang nods and says everyone is stretched at budget time. You leave with sympathy and the same load.
  - *VI:* Anh Khang gật đầu và nói đến mùa ngân sách ai cũng căng. Anh/chị ra về với sự cảm thông và khối lượng cũ.
  - effects: rel.khang.trust +1, stress -1

**c2.** Hand in your resignation, politely, with the notice the contract requires.  
*VI:* Nộp đơn xin nghỉ, lịch sự, báo trước đúng như hợp đồng quy định.

- (100%) Khang reads it twice and does not argue. You hand over the model with a changelog, and walk out lighter than you walked in.
  - *VI:* Anh Khang đọc hai lần và không phản đối. Anh/chị bàn giao mô hình kèm nhật ký thay đổi và bước ra nhẹ nhõm hơn lúc bước vào.
  - effects: rel.khang.trust +2, ENDING walked_away

**c3.** Tell Hanh you are fine and keep going.  
*VI:* Nói với chị Hạnh là anh/chị ổn và tiếp tục.

- (100%) Hanh nods and does not push. You feel slightly worse afterwards for having said it.
  - *VI:* Chị Hạnh gật đầu và không gặng hỏi. Sau đó anh/chị thấy hơi tệ hơn vì đã nói vậy.
  - effects: rel.hanh.trust -1, stress +2

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.budget_kickoff

*random; tags: budget, pressure, dark*

- **Mr Khang:** Budget season. Every department sends its numbers in two weeks. Bao will send a sales target that is half of what he knows he can do, and Lan will send costs with a nice cushion of contingency. Everybody games it, and everybody expects us to know. How do you want to run it?
  - *VI* **Anh Khang:** Mùa ngân sách. Mỗi phòng nộp số liệu trong hai tuần. Anh Bảo sẽ gửi chỉ tiêu bán hàng bằng nửa điều anh biết mình làm được, và chị Lan sẽ gửi chi phí kèm một lớp dự phòng đẹp. Ai cũng chơi trò đó, và ai cũng mong mình biết. Em muốn chạy nó thế nào?

**c1.** Set one method for every department: a template, the evidence behind each number, last year's actuals and the market, and the same questions for everybody.  
*VI:* Đặt một phương pháp cho mọi phòng ban: một mẫu, bằng chứng đằng sau từng con số, số thực của năm ngoái và thị trường, và cùng một bộ câu hỏi cho tất cả.

- (75%) The first submissions come with evidence, and some with embarrassment. Bao and Lan grumble about the template, and fill it in. The numbers are still padded, and now you can see where.
  - *VI:* Các bản nộp đầu tiên đến kèm bằng chứng, một số kèm sự ngượng ngùng. Anh Bảo và chị Lan càu nhàu về mẫu rồi điền. Các con số vẫn bị đệm, và giờ anh/chị thấy được chỗ nào.
  - effects: rel.khang.trust +3, rel.bao.trust -2, rel.lan.trust -2, rep.finance +2, stress +4, arc the_budget: sandbag
- (25%, goes badly) Bao calls the template 'bureaucracy' in front of Mr Cuong. Khang answers calmly that the template is the same for everybody, and that it will stay.
  - *VI:* Anh Bảo gọi mẫu là 'quan liêu' trước mặt anh Cường. Anh Khang trả lời bình tĩnh rằng mẫu giống nhau cho mọi người và sẽ giữ nguyên.
  - effects: rel.khang.trust +3, rel.bao.trust -5, rel.cuong.trust -1, stress +5, arc the_budget: sandbag

**c2.** Take the submissions as a first pass and challenge them afterwards, one by one, where the gap is biggest.  
*VI:* Nhận các bản nộp như vòng đầu và thách thức sau, từng cái một, ở chỗ chênh lớn nhất.

- (100%) The submissions arrive on time and soft. You have four weeks and a long list of challenges.
  - *VI:* Các bản nộp đến đúng hạn và mềm. Anh/chị có bốn tuần và một danh sách thách thức dài.
  - effects: rel.khang.trust +1, stress +3, arc the_budget: sandbag

**c3.** Agree the targets privately with Bao and Lan before they submit, to avoid a fight later.  
*VI:* Thỏa thuận chỉ tiêu riêng với anh Bảo và chị Lan trước khi họ nộp để tránh cãi nhau về sau.

- (70%) The budget is quiet and fast. It is also the product of three phone calls that nobody wrote down, and everyone's number has a small cushion.
  - *VI:* Ngân sách yên ả và nhanh. Nó cũng là sản phẩm của ba cuộc gọi không ai ghi lại, và con số của ai cũng có một lớp đệm nhỏ.
  - effects: rel.bao.trust +4, rel.lan.trust +3, rel.khang.trust -2, stress +1, fact pre_agreed_budget_deals (private), arc the_budget: sandbag
- (30%, goes badly) Huy mentions the private call in a meeting, innocently. Khang asks who else was consulted, and you find you have no list.
  - *VI:* Huy vô tư nhắc cuộc gọi riêng trong một cuộc họp. Anh Khang hỏi ai khác đã được tham vấn, và anh/chị nhận ra mình không có danh sách.
  - effects: rel.bao.trust +2, rel.lan.trust +2, rel.khang.trust -6, rep.finance -3, stress +4, fact pre_agreed_budget_deals (witnessed), arc the_budget: sandbag

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.sandbagged_targets

*comes from a storyline; tags: budget, targets, dark, arc*

- **Mr Bao:** Six percent growth is a realistic number. The market is uncertain, and Anders is not a promise. If I commit to twelve, and miss, I will be punished for ever. Six, and I can beat it, and everyone is happy.
  - *VI* **Anh Bảo:** Tăng trưởng sáu phần trăm là con số thực tế. Thị trường bất định, và ông Anders không phải lời hứa. Nếu anh cam kết mười hai rồi hụt, anh sẽ bị phạt mãi. Sáu thì anh vượt được, và ai cũng vui.
- **Ms Lan:** My costs have nine percent contingency because steel and power are volatile. If you cut it, I will come to you every month to ask for more.
  - *VI* **Chị Lan:** Chi phí của chị có chín phần trăm dự phòng vì thép và điện biến động. Nếu em cắt, mỗi tháng chị sẽ đến xin thêm.

**c1.** Show Bao the pipeline and the market growth, show Lan the commodity ranges, and agree defensible midpoints with the assumptions written down.  
*VI:* Cho anh Bảo xem đường ống đơn hàng và tăng trưởng thị trường, cho chị Lan xem khoảng giá hàng hóa và thống nhất mức giữa có thể bảo vệ, kèm giả định viết ra.

- (70%) Bao argues for an hour and agrees to ten percent. Lan agrees to a four percent contingency and a monthly review of steel. The numbers are lower for them and truer for everyone.
  - *VI:* Anh Bảo tranh luận một giờ và đồng ý mười phần trăm. Chị Lan đồng ý bốn phần trăm dự phòng và xem lại giá thép hằng tháng. Các con số khó hơn cho họ và đúng hơn cho mọi người.
  - effects: rel.bao.trust -3, rel.lan.trust -1, rel.khang.trust +3, rep.finance +3, stress +3, fact documented_budget_assumptions (witnessed), arc the_budget: cut
- (30%, goes badly) Bao goes to Mr Cuong, who tells you to 'be reasonable'. You hold the midpoint and ask Khang to confirm it. He does, with a note of his own.
  - *VI:* Anh Bảo đi gặp anh Cường, người bảo anh/chị 'hợp lý một chút'. Anh/chị giữ mức giữa và nhờ anh Khang xác nhận. Anh xác nhận, kèm một ghi chú riêng.
  - effects: rel.bao.trust -5, rel.lan.trust -1, rel.khang.trust +4, rep.finance +2, stress +5, fact documented_budget_assumptions (witnessed), arc the_budget: cut

**c2.** Split the difference quietly, add a stretch overlay of three percent, and tell neither of them.  
*VI:* Chia đôi chênh lệch lặng lẽ, thêm lớp chỉ tiêu cao ba phần trăm và không báo cho ai trong hai người.

- (100%) The budget lands between sandbagged and honest. Bao beats his number and takes the credit, and Lan finds her cushion has been trimmed and says nothing.
  - *VI:* Ngân sách nằm giữa đệm và trung thực. Anh Bảo vượt con số của mình và nhận công, còn chị Lan thấy lớp dự phòng bị cắt và không nói gì.
  - effects: rel.bao.trust +1, rel.lan.trust -1, stress +2, arc the_budget: cut

**c3.** Accept both numbers as submitted, and keep the gap as a contingency line in the consolidated budget.  
*VI:* Chấp nhận cả hai con số như đã nộp và giữ phần chênh làm dòng dự phòng trong ngân sách hợp nhất.

- (75%) Everybody is pleased. The consolidated budget is quietly soft by about eight percent of EBITDA, and the contingency line is named something else.
  - *VI:* Ai cũng hài lòng. Ngân sách hợp nhất lặng lẽ mềm khoảng tám phần trăm EBITDA, và dòng dự phòng được đặt tên khác.
  - effects: rel.bao.trust +5, rel.lan.trust +4, rel.khang.trust -2, stress +1, fact accepted_sandbagged_targets (private), arc the_budget: cut
- (25%, goes badly) Giang asks why the sales target is half the pipeline. You do not have the pipeline in front of you, and Huy does.
  - *VI:* Chị Giang hỏi vì sao chỉ tiêu bán hàng chỉ bằng nửa đường ống đơn hàng. Anh/chị không có đường ống trước mặt, còn Huy thì có.
  - effects: rel.bao.trust +2, rel.khang.trust -5, rep.boss -3, rep.finance -3, stress +5, fact accepted_sandbagged_targets (witnessed), arc the_budget: cut

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.directors_cut

*comes from a storyline; tags: budget, pressure, dark, arc*

- **Mr Cuong:** The board wants EBITDA up twenty percent. That is the number I have promised. I do not want a discussion about how. I want the budget to say twenty. You are good with the model. Make it work.
  - *VI* **Anh Cường:** Hội đồng muốn EBITDA tăng hai mươi phần trăm. Đó là con số anh đã hứa. Anh không muốn bàn về cách làm. Anh muốn ngân sách ghi hai mươi. Em giỏi mô hình. Làm cho nó chạy.

**c1.** Show Mr Cuong what must be true for twenty percent: price, volume, cost, each with its risk, and propose twelve percent with a named list of initiatives for the rest.  
*VI:* Cho anh Cường xem điều gì phải đúng để đạt hai mươi phần trăm: giá, khối lượng, chi phí, mỗi thứ kèm rủi ro, và đề xuất mười hai phần trăm với danh sách sáng kiến có tên cho phần còn lại.

- (65%) Mr Cuong reads the bridge. 'So twenty needs a price rise that nobody has agreed.' He takes fifteen to the board, with the initiatives named and the risk flagged. It is less than he wanted.
  - *VI:* Anh Cường đọc cầu nối. 'Vậy hai mươi cần một đợt tăng giá chưa ai đồng ý.' Anh đưa mười lăm lên hội đồng, với sáng kiến có tên và rủi ro được ghi. Ít hơn anh muốn.
  - effects: rel.cuong.trust -1, rel.khang.trust +4, rep.boss +2, rep.finance +3, stress +4, arc the_budget: pack
- (35%, goes badly) Mr Cuong says the board will not accept a number with a footnote. Khang backs your bridge in the meeting, and asks him to give the board both.
  - *VI:* Anh Cường nói hội đồng sẽ không chấp nhận một con số có chú thích. Anh Khang ủng hộ cầu nối của anh/chị trong cuộc họp và đề nghị anh đưa cho hội đồng cả hai.
  - effects: rel.cuong.trust -3, rel.khang.trust +4, rep.finance +2, stress +5, arc the_budget: pack

**c2.** Give the board fifteen percent, with the identified initiatives and a flagged risk, and say twenty needs a decision on prices.  
*VI:* Đưa hội đồng mười lăm phần trăm kèm các sáng kiến đã xác định và rủi ro được ghi, và nói hai mươi cần một quyết định về giá.

- (100%) Mr Cuong takes fifteen and the price question to the board. It is a compromise that keeps the numbers attached to their reasons.
  - *VI:* Anh Cường đưa mười lăm và câu hỏi về giá lên hội đồng. Một thỏa hiệp giữ các con số gắn với lý do của chúng.
  - effects: rel.cuong.trust +1, rel.khang.trust +1, stress +3, arc the_budget: pack

**c3.** Add an 'unallocated savings' line to the budget that brings EBITDA to twenty percent, and tell Mr Cuong that the savings will come from somewhere.  
*VI:* Thêm dòng 'tiết kiệm chưa phân bổ' vào ngân sách để đưa EBITDA lên hai mươi phần trăm và nói với anh Cường rằng khoản tiết kiệm sẽ đến từ đâu đó.

- (70%) The budget says twenty. Mr Cuong is delighted. The unallocated line is eight percent of the total, and there is nothing under it.
  - *VI:* Ngân sách ghi hai mươi. Anh Cường rất hài lòng. Dòng chưa phân bổ chiếm tám phần trăm tổng, và bên dưới nó không có gì.
  - effects: rel.cuong.trust +5, rel.khang.trust -4, rep.boss +3, stress +1, fact plugged_the_board_pack (private), arc the_budget: pack
- (30%, goes badly) Khang sees the unallocated line in the draft pack and calls you to his desk. 'What is under this?' he asks. You say 'Savings.' He asks for the list.
  - *VI:* Anh Khang thấy dòng chưa phân bổ trong bản nháp và gọi anh/chị đến bàn. 'Dưới này là gì?' anh hỏi. Anh/chị nói 'Tiết kiệm.' Anh xin danh sách.
  - effects: rel.cuong.trust +3, rel.khang.trust -8, rep.boss -3, rep.finance -4, stress +5, fact plugged_the_board_pack (witnessed), arc the_budget: pack

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.board_pack_plug

*comes from a storyline; tags: budget, board, consequence, arc*

- **Ms Giang:** I read footnotes, Mr Khang. This line says 'unallocated improvements' and the sensitivity table does not match the headline. Could someone explain to me, simply, where the last five points of EBITDA come from, and how confident we are?
  - *VI* **Chị Giang:** Tôi đọc chú thích, anh Khang. Dòng này ghi 'cải thiện chưa phân bổ' và bảng độ nhạy không khớp tiêu đề. Ai đó giải thích giúp tôi, đơn giản, năm điểm EBITDA cuối cùng đến từ đâu, và mình tự tin đến mức nào?
- **Mr Khang:** The analyst who built the bridge can answer that better than I can.
  - *VI* **Anh Khang:** Người phân tích dựng cầu nối trả lời việc đó tốt hơn anh.

**c1.** Explain plainly: what is committed, what is only an initiative, what depends on a price decision, and the range of outcomes. Give her the sensitivity table.  
*VI:* Giải thích rõ ràng: điều gì đã cam kết, điều gì mới chỉ là sáng kiến, điều gì phụ thuộc quyết định giá và khoảng kết quả. Đưa chị bảng độ nhạy.

- (100%) Giang listens, and asks two sharp questions that you can answer. 'Thank you. That is the first time I have understood this slide.' The board approves fifteen with a quarterly review of the three initiatives.
  - *VI:* Chị Giang lắng nghe và hỏi hai câu sắc mà anh/chị trả lời được. 'Cảm ơn. Đây là lần đầu tôi hiểu slide này.' Hội đồng duyệt mười lăm kèm xem lại ba sáng kiến mỗi quý.
  - effects: rel.giang.trust +6, rel.khang.trust +3, rep.boss +3, rep.finance +3, stress +3, arc the_budget: end

**c2.** Say the remaining points are initiatives still being detailed, and that the detail will follow.  
*VI:* Nói các điểm còn lại là sáng kiến đang được chi tiết hóa và chi tiết sẽ đến sau.

- (60%) Giang nods slowly and writes 'detail to follow' in her notes. The board approves, on a promise, and the promise is in the minutes.
  - *VI:* Chị Giang gật đầu chậm và ghi 'chi tiết sẽ đến sau' vào ghi chú. Hội đồng duyệt dựa trên một lời hứa, và lời hứa đó có trong biên bản.
  - effects: rel.giang.trust -1, rel.khang.trust -1, stress +3, arc the_budget: end
- (40%, goes badly) Giang asks for the detail in two weeks. You do not have it, and neither does anyone else.
  - *VI:* Chị Giang xin chi tiết sau hai tuần. Anh/chị không có, và không ai khác có.
  - effects: rel.giang.trust -4, rel.khang.trust -4, rep.boss -3, stress +5, arc the_budget: end

**c3.** Say the remaining points come from procurement savings that Tam has already confirmed.  
*VI:* Nói các điểm còn lại đến từ khoản tiết kiệm mua hàng mà anh Tâm đã xác nhận.

- (50%) Giang accepts it and moves on. Tam, who has not confirmed anything, is asked about it by Mr Cuong the next week, and looks at you from across the room.
  - *VI:* Chị Giang chấp nhận và chuyển sang việc khác. Anh Tâm, người chưa xác nhận gì, được anh Cường hỏi tuần sau và nhìn anh/chị từ phía bên kia phòng.
  - effects: rel.giang.trust +1, rel.tam.trust -8, rel.khang.trust -4, stress +2, fact misled_the_board (private), arc the_budget: end
- (50%, goes badly) Giang writes 'Tam?' in the margin and asks him in the corridor, after the meeting. Tam says he has confirmed nothing. Giang does not raise her voice.
  - *VI:* Chị Giang ghi 'Tâm?' bên lề và hỏi anh ngoài hành lang, sau cuộc họp. Anh Tâm nói anh chưa xác nhận gì. Chị Giang không to tiếng.
  - effects: rel.giang.trust -10, rel.tam.trust -10, rel.khang.trust -8, rep.boss -8, rep.finance -6, stress +8, fact misled_the_board (public), arc the_budget: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.reclassify_ask

*comes from a storyline; tags: bank, accounting, dark, arc*

- **Mr Duc:** There is a hundred and twenty million of maintenance in this quarter's costs. Some of it is major overhauls that extend the life of the presses. If we classify it as capital expenditure, EBITDA goes up and we are under three. Hanh says it is arguable. Can you prepare the reclassification?
  - *VI* **Anh Đức:** Trong chi phí quý này có một trăm hai mươi triệu bảo trì. Một phần là đại tu kéo dài tuổi thọ máy ép. Nếu phân loại là chi đầu tư, EBITDA tăng và mình dưới ba. Chị Hạnh nói là có thể tranh luận. Em chuẩn bị việc phân loại lại được không?

**c1.** Decline to reclassify routine maintenance, review the overhaul items individually with Hanh against the capitalisation policy, and recalculate on that basis only.  
*VI:* Từ chối phân loại lại bảo trì thường xuyên, rà soát từng hạng mục đại tu cùng chị Hạnh theo chính sách vốn hóa và tính lại chỉ trên cơ sở đó.

- (70%) Hanh finds eighteen million that qualify, with invoices and engineers' notes. It moves the ratio from three point two to three point one-eight. It is not enough, and it is true.
  - *VI:* Chị Hạnh tìm ra mười tám triệu đủ điều kiện, có hóa đơn và ghi chú của kỹ sư. Nó đưa tỷ lệ từ ba phẩy hai xuống ba phẩy mười tám. Không đủ, và là sự thật.
  - effects: rel.duc.trust -1, rel.hanh.trust +4, rel.khang.trust +3, rep.finance +3, stress +4, arc the_covenant: timing
- (30%, goes badly) Duc says the policy is a guideline. You show him the page, and the policy says what it says. He is not pleased, and does not push.
  - *VI:* Anh Đức nói chính sách chỉ là hướng dẫn. Anh/chị cho anh xem trang giấy, và chính sách nói đúng điều nó nói. Anh không vui và không ép.
  - effects: rel.duc.trust -3, rel.hanh.trust +3, rel.khang.trust +3, stress +5, arc the_covenant: timing

**c2.** Reclassify the clear overhaul items with Hanh's agreement and the invoices attached, and say that the rest stays in costs.  
*VI:* Phân loại lại các hạng mục đại tu rõ ràng với sự đồng ý của chị Hạnh và hóa đơn đính kèm và nói phần còn lại vẫn nằm trong chi phí.

- (100%) Forty million is reclassified, with the paper to support it. Duc accepts that it is not the whole amount.
  - *VI:* Bốn mươi triệu được phân loại lại, có giấy tờ chứng minh. Anh Đức chấp nhận rằng không phải toàn bộ số tiền.
  - effects: rel.duc.trust +1, rel.hanh.trust +1, stress +3, arc the_covenant: timing

**c3.** Reclassify the whole hundred and twenty million as capital expenditure, with a short memo that calls it 'major overhaul programme'.  
*VI:* Phân loại lại toàn bộ một trăm hai mươi triệu thành chi đầu tư kèm một bản ghi nhớ ngắn gọi nó là 'chương trình đại tu lớn'.

- (70%) The covenant ratio reads two point eight-five. Duc is relieved. Hanh signs because you asked, and writes her own note about the classification on her copy.
  - *VI:* Tỷ lệ cam kết là hai phẩy tám lăm. Anh Đức nhẹ nhõm. Chị Hạnh ký vì anh/chị nhờ và viết ghi chú riêng về việc phân loại trên bản của chị.
  - effects: rel.duc.trust +5, rel.hanh.trust -6, rep.finance +2, stress +1, fact reclassified_costs_to_meet_covenant (private), arc the_covenant: timing
- (30%, goes badly) Quoc, the internal auditor, reads the memo and the invoices and asks which of the hundred and twenty million is actually an overhaul. The list of the others is on Hanh's copy.
  - *VI:* Anh Quốc, kiểm toán nội bộ, đọc bản ghi nhớ và hóa đơn và hỏi trong một trăm hai mươi triệu thì khoản nào thực sự là đại tu. Danh sách các khoản còn lại nằm trên bản của chị Hạnh.
  - effects: rel.duc.trust +2, rel.hanh.trust -8, rel.quoc.trust -8, rep.boss -4, rep.finance -6, stress +6, fact reclassified_costs_to_meet_covenant (witnessed), arc the_covenant: timing

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.quarter_end_timing

*comes from a storyline; tags: bank, timing, dark, arc*

- **Mr Bao:** Ten days to the quarter end. If we ship and invoice the Anders order on the twenty-eighth instead of the fifth, the revenue falls in this quarter. The goods are ready. It is only a date.
  - *VI* **Anh Bảo:** Còn mười ngày đến cuối quý. Nếu mình giao và xuất hóa đơn đơn ông Anders vào ngày hai mươi tám thay vì mùng năm thì doanh thu rơi vào quý này. Hàng đã sẵn sàng. Chỉ là một ngày.
- **Mr Duc:** And if we hold the steel invoices for ten days, the payables go out of this quarter. Thu can do it. Nobody has to know.
  - *VI* **Anh Đức:** Và nếu mình giữ hóa đơn thép mười ngày thì khoản phải trả ra khỏi quý này. Thư làm được. Không ai phải biết.

**c1.** Say that normal shipping and invoice dates stay as they are, report the true figures to the bank, and let the quarter be what it is.  
*VI:* Nói ngày giao hàng và xuất hóa đơn bình thường giữ nguyên, báo số liệu thật cho ngân hàng và để quý là như nó vốn có.

- (100%) Bao shrugs. Duc looks tired. The numbers stay what they are, and you have a clean story for the bank call, which is that you did nothing to the dates.
  - *VI:* Anh Bảo nhún vai. Anh Đức trông mệt mỏi. Các con số vẫn như cũ, và anh/chị có một câu chuyện sạch cho cuộc gọi với ngân hàng, là anh/chị đã không đụng đến ngày tháng.
  - effects: rel.bao.trust -3, rel.duc.trust -2, rel.khang.trust +4, rep.finance +3, stress +3, arc the_covenant: bank_call

**c2.** Allow the Anders shipment on the date it is genuinely ready, with the delivery documents, and say nothing about the invoices.  
*VI:* Cho phép giao đơn ông Anders vào ngày hàng thực sự sẵn sàng, kèm chứng từ giao hàng, và không nói gì về các hóa đơn.

- (100%) The goods ship when they are ready, which happens to be the twenty-eighth. The delivery documents are real. The invoices are not touched. Hanh checks the cut-off, and signs.
  - *VI:* Hàng giao khi sẵn sàng, tình cờ là ngày hai mươi tám. Chứng từ giao hàng là thật. Hóa đơn không bị đụng đến. Chị Hạnh kiểm tra cut-off và ký.
  - effects: rel.bao.trust +1, rel.hanh.trust +1, stress +3, arc the_covenant: bank_call

**c3.** Pull the Anders invoice into this quarter and ask Thu to hold the steel invoices, without a note.  
*VI:* Kéo hóa đơn ông Anders vào quý này và nhờ Thư giữ hóa đơn thép, không ghi chú gì.

- (70%) The ratio reads two point eight-two. Duc and Bao are delighted. Thu holds the invoices and looks at you for a long moment before she agrees.
  - *VI:* Tỷ lệ là hai phẩy tám hai. Anh Đức và anh Bảo rất vui. Thư giữ hóa đơn và nhìn anh/chị một lúc lâu trước khi đồng ý.
  - effects: rel.bao.trust +5, rel.duc.trust +5, rel.thu.trust -6, rep.finance +2, stress +1, fact moved_invoices_across_quarter_end (private), arc the_covenant: bank_call
- (30%, goes badly) The supplier's statement shows invoices dated the twentieth that are posted on the fifth. Thu is asked by the supplier, and tells the truth.
  - *VI:* Sao kê của nhà cung cấp cho thấy hóa đơn ngày hai mươi được hạch toán ngày mùng năm. Thư được nhà cung cấp hỏi và nói sự thật.
  - effects: rel.bao.trust +2, rel.duc.trust +2, rel.thu.trust -8, rel.hanh.trust -6, rep.boss -5, rep.finance -6, stress +6, fact moved_invoices_across_quarter_end (witnessed), arc the_covenant: bank_call

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.phat_asks

*comes from a storyline; tags: bank, disclosure, dark, consequence, arc*

- **Mr Phat:** Thank you for the quarter figures. The committee would like to see the forecast for the next four quarters, with the assumptions, the downside case and what you would do if steel rises a further ten percent. I would prefer the working version, not the board version.
  - *VI* **Anh Phát:** Cảm ơn số liệu quý. Hội đồng tín dụng muốn xem dự báo bốn quý tới kèm giả định, kịch bản xấu và việc anh/chị sẽ làm nếu thép tăng thêm mười phần trăm. Tôi muốn bản làm việc, không phải bản cho hội đồng.

**c1.** Send the working forecast with its assumptions, the downside case and a recovery plan, and flag where you are least sure.  
*VI:* Gửi bản dự báo làm việc kèm giả định, kịch bản xấu và kế hoạch phục hồi và đánh dấu chỗ anh/chị kém chắc chắn nhất.

- (80%) Mr Phat reads for two days and replies: 'This is more than we usually get. We will watch monthly, and we will not reprice.' Khang forwards his reply with one word: 'Good.'
  - *VI:* Anh Phát đọc hai ngày và trả lời: 'Đây là nhiều hơn mức chúng tôi thường nhận. Chúng tôi sẽ theo dõi hằng tháng và sẽ không tính lại lãi.' Anh Khang chuyển thư kèm một chữ: 'Tốt.'
  - effects: rel.phat.trust +5, rel.khang.trust +4, rel.duc.trust +1, rep.finance +3, stress +3, arc the_covenant: end
- (20%, goes badly) The committee finds the downside case uncomfortable and reprices the loan by half a point. Duc is unhappy. The bank still trusts the numbers it was given.
  - *VI:* Hội đồng tín dụng thấy kịch bản xấu đáng lo và tính lại lãi tăng nửa điểm. Anh Đức không vui. Ngân hàng vẫn tin các con số được cung cấp.
  - effects: rel.phat.trust +3, rel.khang.trust +3, rel.duc.trust -2, rep.finance +1, stress +5, arc the_covenant: end

**c2.** Send the base case with caveats, and say the downside case is still being prepared.  
*VI:* Gửi kịch bản cơ sở kèm lưu ý và nói kịch bản xấu vẫn đang được chuẩn bị.

- (100%) Mr Phat accepts it politely and asks again in a month. You have a month to build the downside case you should have sent.
  - *VI:* Anh Phát chấp nhận một cách lịch sự và hỏi lại sau một tháng. Anh/chị có một tháng để dựng kịch bản xấu lẽ ra nên gửi.
  - effects: rel.phat.trust -1, rel.khang.trust +1, stress +3, arc the_covenant: end

**c3.** Send the management case with the optimistic assumptions, leave out the downside, and describe it as the base case.  
*VI:* Gửi kịch bản của ban điều hành với giả định lạc quan, bỏ kịch bản xấu và mô tả nó là kịch bản cơ sở.

- (60%) Mr Phat thanks you and the committee approves a standstill. Duc is delighted. You sent the bank a number that you would not take to the board.
  - *VI:* Anh Phát cảm ơn và hội đồng tín dụng duyệt giữ nguyên. Anh Đức rất vui. Anh/chị đã gửi cho ngân hàng một con số mà anh/chị sẽ không mang lên hội đồng của chính mình.
  - effects: rel.phat.trust +2, rel.duc.trust +5, rel.khang.trust -3, rep.finance +2, stress +1, fact misled_the_bank (private), arc the_covenant: end
- (40%, goes badly) Mr Phat compares your forecast with the monthly management accounts you also send him. The gap between them is visible on one page, and he writes to Duc, politely.
  - *VI:* Anh Phát đối chiếu dự báo của anh/chị với báo cáo quản trị hằng tháng cũng gửi cho anh. Khoảng cách giữa chúng hiện rõ trên một trang, và anh viết thư cho anh Đức, lịch sự.
  - effects: rel.phat.trust -10, rel.duc.trust -4, rel.khang.trust -8, rep.boss -8, rep.finance -8, stress +8, fact misled_the_bank (public), arc the_covenant: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.kpi_definition

*random; tags: kpi, reporting, dark*

- **Ms Lan:** On-time delivery is eighty-one percent. We are measured against the date we first promised the buyer. But the buyer agrees new dates all the time, usually because sales asks. If you measure against the revised dates, we are at ninety-four. That is the number that reflects what the buyer experiences.
  - *VI* **Chị Lan:** Giao hàng đúng hạn là tám mươi mốt phần trăm. Mình bị đo theo ngày hứa lần đầu với khách. Nhưng khách đồng ý ngày mới liên tục, thường vì kinh doanh xin. Nếu đo theo ngày đã sửa thì mình đạt chín mươi tư. Đó là con số phản ánh điều khách trải nghiệm.

**c1.** Publish both figures, with the method for each, and explain that the gap is mostly caused by date changes requested after the order.  
*VI:* Công bố cả hai con số kèm phương pháp cho từng cái và giải thích rằng khoảng cách chủ yếu do các lần đổi ngày được yêu cầu sau khi đặt hàng.

- (70%) The pack shows eighty-one and ninety-four, side by side. Lan is not thrilled, and Bao is less thrilled. The question becomes why dates move, which is the real question.
  - *VI:* Bộ báo cáo hiện tám mươi mốt và chín mươi tư cạnh nhau. Chị Lan không hào hứng, và anh Bảo còn kém hơn. Câu hỏi trở thành vì sao ngày dịch chuyển, đó mới là câu hỏi thật.
  - effects: rel.lan.trust -1, rel.bao.trust -3, rel.khang.trust +3, rep.finance +3, stress +3, fact published_kpi_with_method (witnessed), arc the_kpi_pack: chart
- (30%, goes badly) Mr Cuong reads the two figures and asks which one is correct. You say both are, with different questions. He says 'I want one number', and you hold your position, politely.
  - *VI:* Anh Cường đọc hai con số và hỏi cái nào đúng. Anh/chị nói cả hai đúng, cho các câu hỏi khác nhau. Anh nói 'Anh muốn một con số', và anh/chị giữ quan điểm, lịch sự.
  - effects: rel.lan.trust -1, rel.cuong.trust -3, rel.khang.trust +3, stress +4, fact published_kpi_with_method (witnessed), arc the_kpi_pack: chart

**c2.** Publish the revised-date figure as the headline and the original-date figure in a footnote.  
*VI:* Công bố con số theo ngày đã sửa làm tiêu đề và con số theo ngày gốc trong chú thích.

- (100%) The pack shows ninety-four. Lan is satisfied and the footnote is in six-point type. The directors read the headline.
  - *VI:* Bộ báo cáo hiện chín mươi tư. Chị Lan hài lòng và chú thích in cỡ chữ sáu. Các giám đốc đọc tiêu đề.
  - effects: rel.lan.trust +3, rel.bao.trust +1, stress +2, arc the_kpi_pack: chart

**c3.** Change the KPI definition to the revised dates from the start of the year and restate the earlier months.  
*VI:* Đổi định nghĩa KPI sang ngày đã sửa từ đầu năm và trình bày lại các tháng trước.

- (70%) The trend now looks as if it has always been above ninety. Lan and Bao are delighted. The old reports, which Khoa still has, say something else.
  - *VI:* Xu hướng giờ trông như luôn trên chín mươi. Chị Lan và anh Bảo rất vui. Các báo cáo cũ, mà anh Khoa vẫn giữ, nói điều khác.
  - effects: rel.lan.trust +5, rel.bao.trust +4, rel.khang.trust -3, stress +1, fact redefined_kpi_to_look_better (private), arc the_kpi_pack: chart
- (30%, goes badly) Khang compares last quarter's pack with this quarter's and sees that the earlier months have changed without a note. He asks why, in front of the team.
  - *VI:* Anh Khang so bộ báo cáo quý trước với quý này và thấy các tháng trước đã đổi mà không có ghi chú. Anh hỏi vì sao, trước mặt cả nhóm.
  - effects: rel.lan.trust +2, rel.bao.trust +2, rel.khang.trust -7, rep.finance -4, stress +5, fact redefined_kpi_to_look_better (witnessed), arc the_kpi_pack: chart

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.cherry_picked_chart

*comes from a storyline; tags: kpi, board, dark, arc*

- **Mr Cuong:** For the board I need one chart that shows the factory improving. The trend line starting in March looks very good. January and February were bad because of the storms. Can the chart start in March?
  - *VI* **Anh Cường:** Cho hội đồng anh cần một biểu đồ cho thấy nhà máy đang cải thiện. Đường xu hướng bắt đầu từ tháng Ba trông rất đẹp. Tháng Một và tháng Hai tệ vì bão. Biểu đồ bắt đầu từ tháng Ba được không?

**c1.** Show the full year, with the storm months marked and explained, and an additional view that excludes them, labelled as such.  
*VI:* Cho xem cả năm, các tháng bão được đánh dấu và giải thích, và thêm một góc nhìn loại trừ chúng, có ghi nhãn rõ.

- (80%) Mr Cuong looks at the two charts, and says 'Fine, use both.' Giang asks about the storm months at the board, and the answer is already on the page.
  - *VI:* Anh Cường nhìn hai biểu đồ và nói 'Được, dùng cả hai.' Chị Giang hỏi về các tháng bão ở hội đồng, và câu trả lời đã có sẵn trên trang.
  - effects: rel.cuong.trust -1, rel.giang.trust +3, rel.khang.trust +3, rep.boss +2, stress +2, arc the_kpi_pack: challenge
- (20%, goes badly) Mr Cuong says the board does not read two charts. You send both, with the full-year one on the second page.
  - *VI:* Anh Cường nói hội đồng không đọc hai biểu đồ. Anh/chị gửi cả hai, biểu đồ cả năm ở trang hai.
  - effects: rel.cuong.trust -2, rel.khang.trust +1, stress +3, arc the_kpi_pack: challenge

**c2.** Start the chart in March with a footnote saying the series starts in March, and offer the full series on request.  
*VI:* Cho biểu đồ bắt đầu từ tháng Ba kèm chú thích chuỗi bắt đầu từ tháng Ba và đề nghị cung cấp chuỗi đầy đủ nếu được yêu cầu.

- (100%) The chart is accurate and incomplete. Nobody asks for the full series. You keep it in a folder in case they do.
  - *VI:* Biểu đồ chính xác và không đầy đủ. Không ai xin chuỗi đầy đủ. Anh/chị giữ nó trong một thư mục phòng khi họ hỏi.
  - effects: rel.cuong.trust +2, rel.khang.trust -1, stress +2, arc the_kpi_pack: challenge

**c3.** Start the chart in March, leave the footnote out, and rescale the axis so that the improvement looks steeper.  
*VI:* Cho biểu đồ bắt đầu từ tháng Ba, bỏ chú thích và đổi tỷ lệ trục để cải thiện trông dốc hơn.

- (70%) The chart looks excellent. Mr Cuong beams, the board nods, and Giang looks at the axis for a little longer than the others.
  - *VI:* Biểu đồ trông tuyệt vời. Anh Cường rạng rỡ, hội đồng gật đầu, và chị Giang nhìn trục lâu hơn những người khác một chút.
  - effects: rel.cuong.trust +5, rel.giang.trust -3, rel.khang.trust -2, rep.boss +3, stress +1, fact cherry_picked_chart (private), arc the_kpi_pack: challenge
- (30%, goes badly) Giang asks for the data behind the chart and redraws it on a napkin with the full year. She says nothing, and the napkin is placed in the board minutes.
  - *VI:* Chị Giang xin dữ liệu đằng sau biểu đồ và vẽ lại trên khăn giấy với cả năm. Chị không nói gì, và chiếc khăn giấy được đưa vào biên bản hội đồng.
  - effects: rel.cuong.trust +2, rel.giang.trust -9, rel.khang.trust -6, rep.boss -6, rep.finance -5, stress +6, fact cherry_picked_chart (witnessed), arc the_kpi_pack: challenge

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.kpi_challenge

*comes from a storyline; tags: kpi, reporting, consequence, arc*

- **Mr Khoa:** I have my own on-time figure for Line 3 from the dispatch log, and it does not match the pack. I am not accusing anyone. I would like us to sit down and agree on one definition, and write it on the first page.
  - *VI* **Anh Khoa:** Anh có con số giao đúng hạn của riêng anh cho chuyền 3 từ nhật ký xuất hàng và nó không khớp bộ báo cáo. Anh không buộc tội ai. Anh muốn mình ngồi xuống thống nhất một định nghĩa và ghi nó vào trang đầu.

**c1.** Sit down with Khoa and Lan, reconcile the sources line by line, and publish the agreed definition and the reconciliation.  
*VI:* Ngồi xuống với anh Khoa và chị Lan, đối chiếu các nguồn từng dòng và công bố định nghĩa đã thống nhất cùng bản đối chiếu.

- (100%) It takes two hours and a whiteboard. The three of you agree a definition. Khoa says: 'This is the first time FP&A and QC have the same number.' The pack carries a page on method.
  - *VI:* Mất hai giờ và một tấm bảng trắng. Ba người thống nhất một định nghĩa. Anh Khoa nói: 'Đây là lần đầu FP&A và QC có cùng một con số.' Bộ báo cáo có thêm một trang về phương pháp.
  - effects: rel.khoa.trust +4, rel.lan.trust +1, rel.khang.trust +3, rep.finance +3, rep.qc +3, stress +3, arc the_kpi_pack: end

**c2.** Explain the pack's method to Khoa and say that the difference is a timing issue.  
*VI:* Giải thích phương pháp của bộ báo cáo cho anh Khoa và nói chênh lệch là vấn đề thời điểm.

- (100%) Khoa accepts it, for now. The two numbers continue to differ, and he keeps his own.
  - *VI:* Anh Khoa chấp nhận, tạm thời. Hai con số tiếp tục khác nhau và anh giữ số của riêng mình.
  - effects: rel.khoa.trust -1, stress +2, arc the_kpi_pack: end

**c3.** Tell Khoa that the dispatch log is unreliable, and that the pack is the official number.  
*VI:* Nói với anh Khoa nhật ký xuất hàng không đáng tin và bộ báo cáo là con số chính thức.

- (40%) Khoa nods slowly and writes something down. He does not argue, and stops sending you data.
  - *VI:* Anh Khoa gật đầu chậm và ghi gì đó. Anh không tranh cãi và thôi gửi dữ liệu cho anh/chị.
  - effects: rel.khoa.trust -6, rep.qc -3, stress +2, arc the_kpi_pack: end
- (60%, goes badly) Khoa takes the dispatch log, the pack and the definition history to Duc. The three do not agree, and the meeting is not friendly.
  - *VI:* Anh Khoa mang nhật ký xuất hàng, bộ báo cáo và lịch sử định nghĩa đến anh Đức. Cả ba không khớp, và cuộc họp không thân thiện.
  - effects: rel.khoa.trust -10, rel.duc.trust -4, rel.khang.trust -6, rep.boss -6, rep.qc -6, rep.finance -5, stress +6, arc the_kpi_pack: end

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.variance_explain

*random; tags: variance, reporting, dark*

- **Mr Duc:** Cost of goods is eleven percent over budget this month. Most of it is a steel price effect and a yield problem on Line 3. Mr Cuong reads the variance page first. I would prefer the explanation to say 'timing and other'. Can you write the commentary?
  - *VI* **Anh Đức:** Giá vốn tháng này vượt ngân sách mười một phần trăm. Phần lớn do giá thép và vấn đề năng suất ở chuyền 3. Anh Cường đọc trang chênh lệch đầu tiên. Anh muốn phần giải thích ghi 'thời điểm và khác'. Em viết phần bình luận được không?

**c1.** Write the commentary with the real split: price, volume, yield, and what is expected to reverse and what is not.  
*VI:* Viết bình luận với cách chia thật: giá, khối lượng, năng suất và điều gì dự kiến đảo chiều, điều gì không.

- (80%) Duc reads it twice. 'This is uncomfortable, and this is useful.' Mr Cuong asks about the yield problem for the first time in a year, and Lan gets the time to fix it.
  - *VI:* Anh Đức đọc hai lần. 'Cái này khó chịu, và cái này hữu ích.' Anh Cường hỏi về vấn đề năng suất lần đầu trong một năm, và chị Lan có thời gian để sửa.
  - effects: rel.duc.trust +2, rel.lan.trust +2, rep.finance +3, stress +3
- (20%, goes badly) Mr Cuong says the page is too negative for the board and asks Duc to soften it. Duc does, and tells you he did.
  - *VI:* Anh Cường nói trang này quá tiêu cực cho hội đồng và nhờ anh Đức làm nhẹ. Anh Đức làm và nói với anh/chị là anh đã làm.
  - effects: rel.duc.trust +1, rel.lan.trust +1, stress +4

**c2.** Write the commentary with the main driver stated plainly and the smaller ones grouped, and flag the yield issue for a separate note.  
*VI:* Viết bình luận nêu rõ nguyên nhân chính và gộp các nguyên nhân nhỏ hơn và đánh dấu vấn đề năng suất cho một ghi chú riêng.

- (100%) A balanced page. Duc accepts it, and the yield note sits in his inbox for two weeks.
  - *VI:* Một trang cân đối. Anh Đức chấp nhận, và ghi chú về năng suất nằm trong hộp thư của anh hai tuần.
  - effects: rel.duc.trust +1, stress +2

**c3.** Write 'timing and other' for most of the variance, as asked.  
*VI:* Viết 'thời điểm và khác' cho phần lớn chênh lệch như được yêu cầu.

- (70%) The page reads calmly. Mr Cuong nods at it. Next month the same variance comes back, and 'timing' has not reversed.
  - *VI:* Trang đọc êm dịu. Anh Cường gật đầu. Tháng sau chênh lệch cũ quay lại, và 'thời điểm' không đảo chiều.
  - effects: rel.duc.trust +4, rel.lan.trust -2, stress +1, fact buried_variance_in_other (private)
- (30%, goes badly) Lan reads the variance page and sees 'timing' on a yield problem she has been reporting for six weeks. She asks Khang who wrote it.
  - *VI:* Chị Lan đọc trang chênh lệch và thấy 'thời điểm' đặt trên vấn đề năng suất chị báo cáo sáu tuần nay. Chị hỏi anh Khang ai viết.
  - effects: rel.duc.trust +2, rel.lan.trust -6, rel.khang.trust -5, rep.finance -3, stress +4, fact buried_variance_in_other (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.excel_error

*random; tags: model, error, honesty, dark*

- **Huy:** I was checking your forecast for the sales plan and I think a formula is double counting the Anders order in two months. It is about forty million. You already sent it to the directors on Monday.
  - *VI* **Huy:** Em đang kiểm tra dự báo của anh/chị cho kế hoạch bán hàng và em nghĩ có công thức đếm hai lần đơn ông Anders ở hai tháng. Khoảng bốn mươi triệu. Anh/chị đã gửi cho ban giám đốc hôm thứ Hai.

**c1.** Check the formula now, confirm the error, tell Khang immediately, and send a corrected version with a short note on what changed.  
*VI:* Kiểm tra công thức ngay, xác nhận lỗi, báo anh Khang ngay và gửi bản đã sửa kèm ghi chú ngắn về điều đã đổi.

- (85%) The error is real, and small. Khang says: 'Good. Errors happen. Hiding them is the problem.' The directors see a correction and a change log. Huy gets a thank-you.
  - *VI:* Lỗi có thật, và nhỏ. Anh Khang nói: 'Tốt. Lỗi thì ai cũng có. Giấu lỗi mới là vấn đề.' Các giám đốc thấy bản sửa và nhật ký thay đổi. Huy được cảm ơn.
  - effects: rel.khang.trust +4, rel.huy.trust +4, rep.finance +3, stress +3, fact disclosed_spreadsheet_error (witnessed)
- (15%, goes badly) Mr Cuong has already used the old number in a meeting with the bank. Khang calls Mr Phat himself to update it, and tells you that you did the right thing.
  - *VI:* Anh Cường đã dùng con số cũ trong một cuộc họp với ngân hàng. Anh Khang tự gọi anh Phát để cập nhật và nói với anh/chị rằng anh/chị đã làm đúng.
  - effects: rel.khang.trust +3, rel.huy.trust +3, rel.cuong.trust -2, rep.finance +1, stress +5, fact disclosed_spreadsheet_error (witnessed)

**c2.** Correct the formula in the model, and include the corrected number in next week's forecast with a one-line note.  
*VI:* Sửa công thức trong mô hình và đưa con số đã sửa vào dự báo tuần sau với ghi chú một dòng.

- (100%) The error is fixed and mentioned. The Monday number is never formally withdrawn, and a director quotes it twice.
  - *VI:* Lỗi được sửa và có nhắc tới. Con số hôm thứ Hai không bao giờ được chính thức rút và một giám đốc trích dẫn nó hai lần.
  - effects: rel.khang.trust +1, rel.huy.trust +1, stress +3

**c3.** Fix the formula quietly, and thank Huy, and ask him to keep it to himself because it is small.  
*VI:* Sửa công thức lặng lẽ, cảm ơn Huy và nhờ cậu giữ kín vì nó nhỏ.

- (70%) Huy agrees. The Monday number stays in the directors' decks, and the corrected number appears in the next version without a note. Nothing happens.
  - *VI:* Huy đồng ý. Con số hôm thứ Hai vẫn nằm trong slide của các giám đốc, và con số đã sửa xuất hiện trong phiên bản sau không có ghi chú. Không có chuyện gì xảy ra.
  - effects: rel.huy.trust -2, rel.khang.trust -1, stress +1, fact hid_spreadsheet_error (private)
- (30%, goes badly) Giang asks why the forecast dropped forty million between two versions with no explanation. Khang opens the change log and finds a blank.
  - *VI:* Chị Giang hỏi vì sao dự báo giảm bốn mươi triệu giữa hai phiên bản mà không giải thích. Anh Khang mở nhật ký thay đổi và thấy một chỗ trống.
  - effects: rel.huy.trust -4, rel.khang.trust -7, rel.giang.trust -4, rep.boss -4, rep.finance -5, stress +5, fact hid_spreadsheet_error (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.rolling_forecast_sweeten

*random; tags: forecast, sales, dark*

- **Mr Bao:** My team has fourteen deals in the pipeline that we have just started talking to. I want the forecast to count them at sixty percent. We close more than that, I promise. If it only counts at twenty, my quarter looks bad and the directors will ask hard questions.
  - *VI* **Anh Bảo:** Nhóm anh có mười bốn thương vụ trong đường ống vừa mới bắt đầu nói chuyện. Anh muốn dự báo tính chúng ở sáu mươi phần trăm. Mình chốt nhiều hơn thế, anh hứa. Nếu chỉ tính hai mươi thì quý của anh trông tệ và ban giám đốc sẽ hỏi khó.

**c1.** Weight the pipeline by stage and by the historical conversion rate, show Bao the evidence, and offer a separate upside line for his optimism.  
*VI:* Gán trọng số cho đường ống theo giai đoạn và tỷ lệ chuyển đổi lịch sử, cho anh Bảo xem bằng chứng và đề xuất một dòng kịch bản tốt riêng cho sự lạc quan của anh.

- (70%) Bao argues, then sees the conversion history. The forecast carries a base and an upside, and the quarter closes between them. Bao concedes that his judgement was a little generous.
  - *VI:* Anh Bảo tranh luận rồi thấy lịch sử chuyển đổi. Dự báo có kịch bản cơ sở và kịch bản tốt, và quý đóng ở giữa. Anh Bảo thừa nhận phán đoán của mình hơi hào phóng.
  - effects: rel.bao.trust -2, rel.khang.trust +3, rep.finance +3, stress +3
- (30%, goes badly) Bao takes the matter to Mr Cuong, who asks you to 'work with sales'. You show Mr Cuong the conversion history, and he keeps the base case with a smile that does not reach his eyes.
  - *VI:* Anh Bảo đưa chuyện lên anh Cường, người bảo anh/chị 'hợp tác với kinh doanh'. Anh/chị cho anh Cường xem lịch sử chuyển đổi, và anh giữ kịch bản cơ sở với một nụ cười không tới mắt.
  - effects: rel.bao.trust -5, rel.cuong.trust -2, rel.khang.trust +3, rep.finance +2, stress +5

**c2.** Count them at forty percent, halfway between the evidence and Bao's number, and say the forecast has been adjusted for sales' view.  
*VI:* Tính ở bốn mươi phần trăm, giữa bằng chứng và con số của anh Bảo, và nói dự báo đã được điều chỉnh theo quan điểm của kinh doanh.

- (100%) Bao is satisfied. The forecast is a little optimistic. The shortfall appears the following quarter, as a surprise.
  - *VI:* Anh Bảo hài lòng. Dự báo hơi lạc quan. Phần hụt xuất hiện quý sau, như một bất ngờ.
  - effects: rel.bao.trust +2, rel.khang.trust -1, stress +2

**c3.** Count them at sixty percent as Bao asks, and write 'per sales' in the footnote.  
*VI:* Tính ở sáu mươi phần trăm như anh Bảo yêu cầu và ghi 'theo kinh doanh' trong chú thích.

- (70%) The forecast looks excellent for a quarter. Bao is a friend. The directors plan hiring and an expansion on the number.
  - *VI:* Dự báo trông tuyệt vời một quý. Anh Bảo là bạn. Ban giám đốc lên kế hoạch tuyển dụng và mở rộng dựa trên con số.
  - effects: rel.bao.trust +5, rel.khang.trust -3, rep.finance +1, stress +1, fact sweetened_pipeline_forecast (private)
- (30%, goes badly) The quarter closes at the weighted number. Khang asks why the forecast was sixty percent when the history says twenty-five, and the footnote says 'per sales'.
  - *VI:* Quý đóng ở mức có trọng số. Anh Khang hỏi vì sao dự báo là sáu mươi phần trăm khi lịch sử nói hai mươi lăm và chú thích ghi 'theo kinh doanh'.
  - effects: rel.bao.trust +2, rel.khang.trust -8, rep.boss -4, rep.finance -5, stress +5, fact sweetened_pipeline_forecast (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.roi_pet_project

*random; tags: investment, roi, dark*

- **Mr Cuong:** I want a new coating line. It is a personal conviction. I need an investment case that shows a payback inside three years, so that the board approves it. The volumes are what they are, but you can be a little creative with the price premium and the yield.
  - *VI* **Anh Cường:** Anh muốn một dây chuyền phủ mới. Đó là niềm tin cá nhân. Anh cần một hồ sơ đầu tư cho thấy hoàn vốn trong ba năm để hội đồng duyệt. Khối lượng thì vậy, nhưng em có thể sáng tạo một chút với mức giá cao hơn và năng suất.

**c1.** Build the case on evidence, show the payback range, and tell Mr Cuong what would have to be true for three years, and what the downside looks like.  
*VI:* Dựng hồ sơ trên bằng chứng, cho xem khoảng thời gian hoàn vốn và nói với anh Cường điều gì phải đúng để đạt ba năm và kịch bản xấu trông thế nào.

- (60%) The honest payback is four years, and three if the price premium holds. Mr Cuong reads it, grumbles, and takes it to the board anyway with the range. The board approves a smaller first phase.
  - *VI:* Thời gian hoàn vốn trung thực là bốn năm, và ba năm nếu mức giá cao được giữ. Anh Cường đọc, càu nhàu và vẫn đưa lên hội đồng kèm khoảng giá trị. Hội đồng duyệt một giai đoạn đầu nhỏ hơn.
  - effects: rel.cuong.trust -1, rel.khang.trust +4, rel.giang.trust +2, rep.finance +3, stress +4
- (40%, goes badly) Mr Cuong says the board will not read a range. He shelves the project for the year, and tells you that you have a talent for finding reasons not to.
  - *VI:* Anh Cường nói hội đồng sẽ không đọc một khoảng giá trị. Anh gác dự án một năm và nói với anh/chị rằng anh/chị có tài tìm lý do để không làm.
  - effects: rel.cuong.trust -4, rel.khang.trust +3, rep.finance +2, stress +4

**c2.** Build the case with the optimistic end of the evidence, and mark each assumption as optimistic.  
*VI:* Dựng hồ sơ với đầu lạc quan của bằng chứng và đánh dấu từng giả định là lạc quan.

- (100%) The payback reads two point eight years, and every optimistic assumption has a tag. The board approves it, and the tags are in the appendix.
  - *VI:* Thời gian hoàn vốn là hai phẩy tám năm, và mọi giả định lạc quan đều có nhãn. Hội đồng duyệt, và các nhãn nằm trong phụ lục.
  - effects: rel.cuong.trust +2, rel.khang.trust +1, stress +3

**c3.** Build the case with a price premium and yield that give a two-year payback, and do not label them.  
*VI:* Dựng hồ sơ với mức giá cao hơn và năng suất cho hoàn vốn hai năm và không gắn nhãn.

- (70%) The board approves it on the spot. Mr Cuong shakes your hand. The price premium that the case assumes has never been quoted to a buyer.
  - *VI:* Hội đồng duyệt ngay tại chỗ. Anh Cường bắt tay anh/chị. Mức giá cao mà hồ sơ giả định chưa từng được báo giá cho khách.
  - effects: rel.cuong.trust +6, rel.khang.trust -4, rep.boss +3, stress +1, fact inflated_roi_case (private)
- (30%, goes badly) Giang asks Bao whether any buyer has agreed to the price premium. Bao says no. The question goes back to FP&A with a date.
  - *VI:* Chị Giang hỏi anh Bảo liệu có khách nào đồng ý mức giá cao đó chưa. Anh Bảo nói chưa. Câu hỏi quay lại FP&A kèm một ngày hạn.
  - effects: rel.cuong.trust +2, rel.giang.trust -7, rel.khang.trust -7, rep.boss -5, rep.finance -6, stress +6, fact inflated_roi_case (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.commission_baseline

*random; tags: commission, targets, dark*

- **Mr Bao:** Sales commission is calculated against the baseline you publish for each team. My team's baseline is above what we actually did last year because of the one big order. Could you reset it to the average? It is only a baseline. Nobody will be paid more than they earned.
  - *VI* **Anh Bảo:** Hoa hồng bán hàng tính theo mức cơ sở em công bố cho từng nhóm. Mức cơ sở của nhóm anh cao hơn thực tế năm ngoái vì một đơn lớn. Em đặt lại về mức trung bình được không? Chỉ là mức cơ sở thôi. Không ai nhận nhiều hơn họ xứng đáng.

**c1.** Keep the baseline and propose a rule that normalises one-off orders for everyone, applied the same way to every team.  
*VI:* Giữ mức cơ sở và đề xuất quy tắc chuẩn hóa các đơn đột xuất cho tất cả, áp dụng như nhau cho mọi nhóm.

- (70%) Bao sulks, and accepts. The normalisation rule is approved for next year, and two other managers thank you privately for it.
  - *VI:* Anh Bảo hờn dỗi và chấp nhận. Quy tắc chuẩn hóa được duyệt cho năm sau, và hai quản lý khác cảm ơn anh/chị riêng vì điều đó.
  - effects: rel.bao.trust -3, rel.khang.trust +3, rep.finance +3, stress +3
- (30%, goes badly) Bao argues that a rule for next year does not help this year's team. He has a point, and nobody has an answer for it.
  - *VI:* Anh Bảo lập luận một quy tắc cho năm sau không giúp nhóm năm nay. Anh có lý, và không ai có câu trả lời.
  - effects: rel.bao.trust -4, rel.khang.trust +2, stress +4

**c2.** Reset the baseline to the average only if Duc and Khang approve in writing, with the reason.  
*VI:* Chỉ đặt lại mức cơ sở về trung bình nếu anh Đức và anh Khang duyệt bằng văn bản, kèm lý do.

- (100%) Duc approves, with a note that the reset applies to any team in the same position. The paper trail exists, and so does a precedent.
  - *VI:* Anh Đức duyệt kèm ghi chú rằng việc đặt lại áp dụng cho mọi nhóm cùng hoàn cảnh. Có dấu vết giấy tờ, và có một tiền lệ.
  - effects: rel.bao.trust +1, rel.duc.trust +1, stress +2

**c3.** Reset the baseline quietly, and do not mention it to the other teams.  
*VI:* Đặt lại mức cơ sở lặng lẽ và không nhắc với các nhóm khác.

- (70%) Bao's team gets a larger commission. Nobody notices for a quarter. Bao thanks you with lunch.
  - *VI:* Nhóm anh Bảo nhận hoa hồng lớn hơn. Một quý không ai nhận ra. Anh Bảo cảm ơn bằng một bữa trưa.
  - effects: rel.bao.trust +5, rel.khang.trust -2, stress +1, fact adjusted_commission_baseline (private)
- (30%, goes badly) Another team lead compares baselines in the canteen. He asks Khang why one team's baseline fell by eleven percent in March.
  - *VI:* Một trưởng nhóm khác so các mức cơ sở ở căng tin. Anh hỏi anh Khang vì sao mức cơ sở của một nhóm giảm mười một phần trăm vào tháng Ba.
  - effects: rel.bao.trust +2, rel.khang.trust -7, rep.boss -4, rep.finance -5, stress +5, fact adjusted_commission_baseline (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.early_board_numbers

*random; tags: confidentiality, board, dark*

- **Huy:** Could you show me the board pack numbers a couple of days before they go out? The owner family has a friend who trades in our supplier's shares, and Bao says that if the numbers are good, we should tell our friends at the steel company, to keep the relationship warm.
  - *VI* **Huy:** Anh/chị cho em xem số liệu bộ báo cáo hội đồng trước vài ngày khi gửi được không? Gia đình chủ sở hữu có một người bạn giao dịch cổ phiếu nhà cung cấp của mình, và anh Bảo nói nếu số tốt thì mình nên báo bạn bên công ty thép để giữ quan hệ.

**c1.** Decline, explain that the board numbers are confidential until released, and offer the published figures from last quarter.  
*VI:* Từ chối, giải thích số liệu hội đồng là bảo mật đến khi được công bố và đưa số liệu đã công bố của quý trước.

- (100%) Huy blushes, and says he did not think of it that way. He thanks you for saying it without a lecture. Bao grumbles.
  - *VI:* Huy đỏ mặt và nói em không nghĩ như vậy. Cậu cảm ơn anh/chị vì đã nói mà không giảng đạo lý. Anh Bảo càu nhàu.
  - effects: rel.huy.trust +4, rel.bao.trust -2, rel.khang.trust +2, rep.finance +2, stress +1

**c2.** Say you will think about it, and give him only the headline direction, up or down.  
*VI:* Nói anh/chị sẽ suy nghĩ và chỉ cho cậu hướng chung, tăng hay giảm.

- (100%) Huy says 'Up', and repeats it to Bao. A conversation happens at lunch that you wish you had prevented.
  - *VI:* Huy nói 'Tăng' và nhắc lại với anh Bảo. Một cuộc trò chuyện diễn ra vào bữa trưa mà anh/chị ước mình đã ngăn.
  - effects: rel.huy.trust +1, rel.bao.trust +2, rel.khang.trust -2, stress +2

**c3.** Send Huy the draft pack, and tell him not to share it.  
*VI:* Gửi Huy bản nháp bộ báo cáo và bảo cậu đừng chia sẻ.

- (60%) Huy reads it, and tells Bao on the stairs. Bao makes a phone call that evening, which you do not hear about.
  - *VI:* Huy đọc và nói với anh Bảo trên cầu thang. Tối đó anh Bảo gọi một cuộc điện thoại mà anh/chị không nghe nói.
  - effects: rel.huy.trust +4, rel.bao.trust +4, rel.khang.trust -3, stress +1, fact leaked_board_numbers (private)
- (40%, goes badly) The supplier's shares move on the Monday before the board pack goes out. A regulator's letter asks the company who had access to the draft. Your name is on the access log.
  - *VI:* Cổ phiếu nhà cung cấp biến động vào thứ Hai trước khi bộ báo cáo hội đồng được gửi. Một công văn của cơ quan quản lý hỏi công ty ai được truy cập bản nháp. Tên anh/chị có trong nhật ký truy cập.
  - effects: rel.huy.trust +1, rel.bao.trust +2, rel.khang.trust -9, rep.boss -10, rep.finance -8, stress +9, fact leaked_board_numbers (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.capex_split

*random; tags: capex, approvals, dark*

- **Ms Lan:** I need a new hydraulic unit for press 2: ninety million. Approval above fifty million goes to the board and takes six weeks. If you raise it as two purchase requests of forty-five million each, I can have it in a fortnight. They are two parts. Almost.
  - *VI* **Chị Lan:** Chị cần một bộ thủy lực mới cho máy ép 2: chín mươi triệu. Phê duyệt trên năm mươi triệu phải lên hội đồng và mất sáu tuần. Nếu em lập hai đề nghị mua bốn mươi lăm triệu mỗi cái, chị có trong hai tuần. Chúng là hai bộ phận. Gần như vậy.

**c1.** Raise one request for ninety million, with a business case for urgency, and ask Duc for an emergency approval.  
*VI:* Lập một đề nghị chín mươi triệu kèm lý do khẩn cấp và nhờ anh Đức duyệt khẩn.

- (70%) Duc approves an emergency request in four days, with the board informed after. Lan gets the unit, and is not thrilled with the form.
  - *VI:* Anh Đức duyệt khẩn trong bốn ngày, báo hội đồng sau. Chị Lan có bộ thủy lực, và không hài lòng với thủ tục.
  - effects: rel.lan.trust -1, rel.duc.trust +3, rep.finance +2, stress +3
- (30%, goes badly) Duc says there is no emergency route this month and the board will meet in four weeks. The press runs at half load.
  - *VI:* Anh Đức nói tháng này không có đường khẩn cấp và hội đồng họp sau bốn tuần. Máy ép chạy nửa tải.
  - effects: rel.lan.trust -4, rel.duc.trust +1, stress +4

**c2.** Raise the two parts as separate requests only if the supplier will quote them as separate, genuinely independent items.  
*VI:* Chỉ lập hai bộ phận thành hai đề nghị riêng nếu nhà cung cấp báo giá chúng là hai hạng mục thực sự độc lập.

- (100%) The supplier quotes a pump and a valve block as separate items, with separate part numbers. It is a legitimate split, and Duc confirms that. It saves a fortnight.
  - *VI:* Nhà cung cấp báo giá bơm và khối van thành các hạng mục riêng, có mã riêng. Đó là việc tách hợp lệ, và anh Đức xác nhận. Tiết kiệm hai tuần.
  - effects: rel.lan.trust +1, rel.duc.trust +1, stress +2

**c3.** Raise two requests of forty-five million for one unit, to stay under the approval limit.  
*VI:* Lập hai đề nghị bốn mươi lăm triệu cho một bộ để nằm dưới hạn mức phê duyệt.

- (70%) The requests go through in a day each. Lan has the unit in a fortnight and thanks you with a smile. The two requests have the same supplier, the same date and consecutive numbers.
  - *VI:* Các đề nghị qua trong một ngày mỗi cái. Chị Lan có bộ thủy lực trong hai tuần và cảm ơn bằng một nụ cười. Hai đề nghị cùng nhà cung cấp, cùng ngày và số liên tiếp.
  - effects: rel.lan.trust +5, rel.duc.trust -1, stress +1, fact split_purchase_under_limit (private)
- (30%, goes badly) Quoc's quarterly test looks for consecutive purchases to the same supplier under the limit. He finds your two, and asks Khang to explain.
  - *VI:* Phép kiểm tra hằng quý của anh Quốc tìm các lần mua liên tiếp từ cùng nhà cung cấp dưới hạn mức. Anh tìm ra hai đề nghị của anh/chị và nhờ anh Khang giải thích.
  - effects: rel.lan.trust +2, rel.duc.trust -5, rel.khang.trust -6, rel.quoc.trust -6, rep.boss -4, rep.finance -5, stress +5, fact split_purchase_under_limit (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.cost_allocation

*random; tags: costing, allocation, dark*

- **Mr Bao:** The new premium range loses money on your allocation. You are charging it a full share of the factory overhead. If you allocate overhead by revenue instead of by machine hours, the premium range makes a margin, and the directors keep funding it. It is only a method.
  - *VI* **Anh Bảo:** Dòng cao cấp mới lỗ theo cách phân bổ của em. Em tính cho nó đầy đủ phần chi phí chung của nhà máy. Nếu phân bổ chi phí chung theo doanh thu thay vì theo giờ máy thì dòng cao cấp có biên lợi nhuận và ban giám đốc tiếp tục đầu tư. Chỉ là một phương pháp thôi.

**c1.** Keep the allocation by machine hours, show the true margin, and offer a sensitivity page that shows both methods and what each would change.  
*VI:* Giữ phân bổ theo giờ máy, cho xem biên lợi nhuận thật và đưa trang độ nhạy hiển thị cả hai phương pháp và điều mỗi cái thay đổi.

- (70%) The premium range is shown at a loss of three percent, with a path to break-even at volume. The directors keep funding it with open eyes, and Bao says it is the first fair hearing it has had.
  - *VI:* Dòng cao cấp được thể hiện lỗ ba phần trăm kèm lộ trình hòa vốn ở mức sản lượng. Ban giám đốc tiếp tục đầu tư với con mắt mở, và anh Bảo nói đây là lần đầu nó được xét công bằng.
  - effects: rel.bao.trust +1, rel.khang.trust +3, rep.finance +3, stress +3
- (30%, goes badly) The directors read the loss and stop the premium range. Bao is angry, and tells you that you killed it. You wrote the truth, and it still feels like that.
  - *VI:* Ban giám đốc đọc con số lỗ và dừng dòng cao cấp. Anh Bảo giận và nói anh/chị đã giết nó. Anh/chị đã viết sự thật, và vẫn cảm thấy như vậy.
  - effects: rel.bao.trust -6, rel.khang.trust +3, rep.finance +2, stress +5

**c2.** Switch to a blended allocation, half machine hours and half revenue, and document the reason as 'transition'.  
*VI:* Chuyển sang phân bổ kết hợp, nửa giờ máy nửa doanh thu, và ghi lý do là 'chuyển tiếp'.

- (100%) The premium range shows break-even. The allocation note says 'transition'. Nobody asks what the transition is to.
  - *VI:* Dòng cao cấp hiện hòa vốn. Ghi chú phân bổ ghi 'chuyển tiếp'. Không ai hỏi chuyển tiếp sang đâu.
  - effects: rel.bao.trust +2, rel.khang.trust -1, stress +2

**c3.** Allocate overhead by revenue for the premium range only, and keep the other ranges on machine hours.  
*VI:* Phân bổ chi phí chung theo doanh thu chỉ cho dòng cao cấp và giữ các dòng khác theo giờ máy.

- (70%) The premium range earns a nice margin. The standard range, which bears the extra overhead, quietly looks worse. Lan notices that her costs have gone up by no reason she can find.
  - *VI:* Dòng cao cấp có biên lợi nhuận đẹp. Dòng tiêu chuẩn, gánh thêm chi phí chung, lặng lẽ trông tệ hơn. Chị Lan nhận ra chi phí của chị tăng mà chị không tìm được lý do.
  - effects: rel.bao.trust +5, rel.lan.trust -5, rel.khang.trust -3, stress +1, fact skewed_cost_allocation (private)
- (30%, goes badly) Quoc's review compares allocation methods across product lines, and finds two. He asks Khang for the decision paper, and there is none.
  - *VI:* Buổi rà soát của anh Quốc so các phương pháp phân bổ giữa các dòng sản phẩm và thấy có hai. Anh xin anh Khang giấy quyết định, và không có.
  - effects: rel.bao.trust +2, rel.lan.trust -5, rel.khang.trust -7, rel.quoc.trust -6, rep.boss -4, rep.finance -6, stress +6, fact skewed_cost_allocation (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.audit_asks

*random; tags: audit, dark, consequence*

- **Mr Quoc:** I have a list of items from the planning cycle I would like to understand: a reclassification of maintenance costs, some invoices that moved across the quarter end, a line in the board pack with nothing under it, and a missing set of model versions. I would like to hear from the person who prepared the numbers.
  - *VI* **Anh Quốc:** Tôi có một danh sách các mục trong chu kỳ kế hoạch muốn hiểu: việc phân loại lại chi phí bảo trì, một số hóa đơn dịch qua cuối quý, một dòng trong bộ báo cáo hội đồng không có gì bên dưới và một bộ phiên bản mô hình bị mất. Tôi muốn nghe từ người đã chuẩn bị các con số.

**c1.** Tell him what happened: who asked, what you agreed, what should have been done, and what is being corrected. Give him the files.  
*VI:* Kể cho ông ấy những gì đã xảy ra: ai nhờ, anh/chị đã đồng ý gì, lẽ ra nên làm gì và đang sửa gì. Đưa ông hồ sơ.

- (100%) Quoc writes it all down. The finding is serious, but it is recorded as 'self-reported and corrected'. The classification is reversed, the bank is told, and you receive a formal warning.
  - *VI:* Anh Quốc ghi lại tất cả. Phát hiện nghiêm trọng, nhưng được ghi nhận là 'tự báo cáo và đã sửa'. Việc phân loại được đảo lại, ngân hàng được báo và anh/chị nhận cảnh cáo chính thức.
  - effects: rel.quoc.trust +2, rel.khang.trust -2, rel.duc.trust -3, rep.boss -5, stress +6, fact came_clean_to_auditor (witnessed)

**c2.** Give him the files, and say the decisions were Duc's and Mr Cuong's, and that FP&A prepared what it was asked.  
*VI:* Đưa ông các tệp và nói các quyết định là của anh Đức và anh Cường, FP&A chỉ chuẩn bị điều được yêu cầu.

- (40%) Quoc notes that the analyst built and signed the numbers. He writes it down, carefully.
  - *VI:* Anh Quốc ghi rằng người phân tích đã dựng và ký các con số. Anh ghi lại, cẩn thận.
  - effects: rel.quoc.trust -5, rel.khang.trust -4, rel.duc.trust -6, rep.boss -4, stress +4
- (60%, goes badly) Hanh and Thu are called in. Each has her own copy of the instructions, and the emails are in the same order. Quoc places them next to your notes.
  - *VI:* Chị Hạnh và Thư được gọi vào. Mỗi người có bản sao chỉ dẫn của mình, và các email theo cùng thứ tự. Anh Quốc đặt chúng cạnh ghi chú của anh/chị.
  - effects: rel.quoc.trust -10, rel.hanh.trust -8, rel.thu.trust -8, rel.khang.trust -8, rep.boss -10, stress +8

**c3.** Say you do not recall the details, and offer to look.  
*VI:* Nói anh/chị không nhớ chi tiết và đề nghị đi tìm.

- (40%) Quoc gives you a week. You find the files and hand them over. It is not the whole truth, but it is something.
  - *VI:* Anh Quốc cho anh/chị một tuần. Anh/chị tìm thấy hồ sơ và nộp. Không phải toàn bộ sự thật, nhưng là một phần.
  - effects: rel.quoc.trust -4, stress +4, fact stalled_the_auditor (private)
- (60%, goes badly) The server backups, the supplier statements and the bank's copy of the covenant calculation arrive on the same afternoon. Quoc has them on the table next to your notes.
  - *VI:* Bản sao lưu máy chủ, sao kê nhà cung cấp và bản tính điều khoản cam kết của ngân hàng đến cùng một buổi chiều. Anh Quốc để chúng trên bàn cạnh ghi chú của anh/chị.
  - effects: rel.quoc.trust -10, rel.khang.trust -6, rep.boss -8, rep.finance -6, stress +7, fact stalled_the_auditor (witnessed)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## fpa.board_blame

*random; tags: pressure, consequence*

- **Ms Giang:** The board has received a letter from the bank. It questions the forecast it was given in the autumn, and asks who prepared it. The board is meeting tomorrow, and I would like to know, before it does, who in finance is responsible for the numbers. I would like to hear it from you first.
  - *VI* **Chị Giang:** Hội đồng nhận được thư của ngân hàng. Thư đặt câu hỏi về dự báo được gửi hồi mùa thu và hỏi ai chuẩn bị. Hội đồng họp ngày mai, và tôi muốn biết, trước khi họp, ai ở tài chính chịu trách nhiệm về các con số. Tôi muốn nghe từ anh/chị trước.

**c1.** Tell her the real account: what you were asked, what you agreed to change, and your own part. Show her the version history.  
*VI:* Nói với chị bản tường trình thật: anh/chị được yêu cầu gì, đồng ý đổi gì và phần của chính mình. Cho chị xem lịch sử phiên bản.

- (100%) Giang reads it slowly, and takes your account to the board with her own note beside it. You are moved off bank reporting and keep your job and, eventually, your name.
  - *VI:* Chị Giang đọc chậm và mang bản tường trình của anh/chị đến hội đồng kèm ghi chú của chính chị. Anh/chị bị chuyển khỏi báo cáo cho ngân hàng và giữ được việc và về sau là cả danh tiếng.
  - effects: rel.giang.trust +3, rel.khang.trust +2, rep.boss -8, rep.finance -3, stress +7, fact came_clean_to_auditor (witnessed)

**c2.** Say the forecast was Duc's and Mr Cuong's, and that you only prepared the model.  
*VI:* Nói dự báo là của anh Đức và anh Cường và anh/chị chỉ chuẩn bị mô hình.

- (40%) The board treats it as shared responsibility. Nobody leaves the room liked, and Duc stops speaking to you.
  - *VI:* Hội đồng coi đó là trách nhiệm chung. Không ai rời phòng với thiện cảm, và anh Đức thôi nói chuyện với anh/chị.
  - effects: rel.duc.trust -10, rel.khang.trust -4, rep.boss -4, stress +4
- (60%, goes badly) Khang has the emails that came with each change, and your replies. He reads two of them aloud, without raising his voice.
  - *VI:* Anh Khang có các email đi kèm mỗi thay đổi và trả lời của anh/chị. Anh đọc to hai cái, không to tiếng.
  - effects: rel.duc.trust -8, rel.khang.trust -12, rep.boss -10, stress +8

**c3.** Say that Huy built the sales inputs and that the errors are in his data.  
*VI:* Nói Huy dựng đầu vào bán hàng và các sai sót nằm trong dữ liệu của cậu.

- (30%) The board nods and Huy is given a warning that he does not contest. He resigns in two months. The inputs are still in your formulas.
  - *VI:* Hội đồng gật đầu và Huy nhận một cảnh cáo mà cậu không phản đối. Cậu nghỉ sau hai tháng. Các đầu vào vẫn nằm trong công thức của anh/chị.
  - effects: rel.huy.trust -25, rel.khang.trust -6, rep.boss -4, stress +6, fact blamed_sales_planner (private)
- (70%, goes badly) Huy has the email chain showing the optimistic assumptions came from FP&A's own adjustments. He puts it on the table.
  - *VI:* Huy có chuỗi email cho thấy các giả định lạc quan đến từ điều chỉnh của chính FP&A. Cậu đặt nó lên bàn.
  - effects: rel.huy.trust -25, rel.khang.trust -10, rep.boss -14, stress +9, fact blamed_sales_planner (public)

Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:

---

## Lessons shown in the end-of-year review

- **you accepted the FP&A lead role without asking what the condition meant** (severity 3): A promotion with an unspoken condition is a decision to be made later, under pressure, by someone who has already said yes.
  - *VI:* Một lần thăng chức với điều kiện không nói ra là một quyết định phải đưa ra sau, dưới áp lực, bởi người đã nói có.
- **you accepted targets you knew were set low, and kept the gap as a cushion** (severity 4): Accepting a sandbagged target teaches every department that sandbagging works. The soft budget is then the baseline for next year's, and for everyone's bonus.
  - *VI:* Chấp nhận chỉ tiêu đặt thấp dạy mọi phòng ban rằng đặt thấp có hiệu quả. Ngân sách mềm sau đó là mốc cho năm sau, và cho thưởng của mọi người.
- **you reset one team's commission baseline without approval and told nobody** (severity 5): A baseline is a rule about money. Changing it for one team, quietly, is paying a favour out of everyone else's fairness.
  - *VI:* Mức cơ sở là quy tắc về tiền. Đổi nó cho một nhóm, lặng lẽ, là trả một ân huệ bằng sự công bằng của mọi người khác.
- **you blamed a junior planner for forecast assumptions that you had adjusted yourself** (severity 7): The junior colleague who gave you the raw inputs also kept the emails that show what you did with them. Blaming them is the fastest way to lose every future honest input.
  - *VI:* Đồng nghiệp cấp dưới đưa bạn đầu vào thô cũng giữ các email cho thấy bạn đã làm gì với chúng. Đổ lỗi cho họ là cách nhanh nhất để mất mọi đầu vào trung thực sau này.
- **you wrote a real cost problem into the variance commentary as 'timing and other'** (severity 4): A variance explanation exists so someone can act. Putting a real driver under 'other' removes the one person who is trying to fix it from the conversation.
  - *VI:* Giải thích chênh lệch tồn tại để ai đó hành động. Đặt nguyên nhân thật dưới 'khác' loại người đang cố sửa nó ra khỏi cuộc trò chuyện.
- **you told the auditor the truth about entries you knew were wrong** (severity 2): Telling an auditor the truth does not erase the mistake, but it separates an error from a cover-up, and that difference is what a fair review weighs most.
  - *VI:* Nói thật với kiểm toán viên không xóa được sai sót, nhưng nó tách lỗi khỏi việc che giấu, và sự khác biệt đó là điều một buổi xem xét công bằng cân nhắc nhiều nhất.
- **you started a chart where the trend looked best and rescaled the axis, without a note** (severity 4): A chart is an argument. Choosing the start date and the axis to flatter the trend, with no footnote, makes the argument without showing the evidence against it.
  - *VI:* Biểu đồ là một lập luận. Chọn ngày bắt đầu và trục để tâng bốc xu hướng, không chú thích, là lập luận mà không cho xem bằng chứng chống lại.
- **you deleted earlier versions of a model before an audit** (severity 6): A model's history is its audit trail. Deleting it removes the one thing that proves the final numbers were not steered, and the backup usually exists.
  - *VI:* Lịch sử của mô hình là dấu vết kiểm toán. Xóa nó là bỏ thứ duy nhất chứng minh số cuối không bị lái, và bản sao lưu thường vẫn tồn tại.
- **you told the finance director and the bank early that the covenant was at risk** (severity 2): A covenant risk raised early is a negotiation; raised late it is a default. Banks forgive a bad number far more easily than a surprise.
  - *VI:* Rủi ro cam kết được nêu sớm là một cuộc thương lượng; nêu muộn là vỡ nợ. Ngân hàng tha thứ cho con số xấu dễ hơn nhiều so với bất ngờ.
- **you reported an error in a forecast the moment you confirmed it, with a corrected version** (severity 1): An error disclosed at once costs a short, awkward email. The same error, found by someone else, costs trust in every spreadsheet you have sent.
  - *VI:* Lỗi được báo ngay tốn một email ngắn, gượng gạo. Cùng lỗi đó, do người khác tìm ra, tốn lòng tin vào mọi bảng tính bạn từng gửi.
- **you wrote down the assumptions behind each department's budget number** (severity 1): A written assumption can be challenged, updated and defended. It costs a difficult conversation in August and saves a worse one in March.
  - *VI:* Một giả định viết ra có thể bị thách thức, cập nhật và bảo vệ. Nó tốn một cuộc nói chuyện khó vào tháng Tám và tiết kiệm một cuộc tệ hơn vào tháng Ba.
- **you fixed an error in a forecast that had already gone to the directors and did not say so** (severity 6): The error was small. The silence is not. The old number is still being used, and the person who found the problem learns that errors are to be kept quiet.
  - *VI:* Lỗi thì nhỏ. Sự im lặng thì không. Con số cũ vẫn đang được dùng, và người tìm ra vấn đề biết rằng lỗi cần được giữ im.
- **you built an investment case on a price premium and yield nobody had tested** (severity 5): An investment case with unlabelled optimism lets the board decide on the wrong evidence. The first buyer who is asked about the premium becomes the truth.
  - *VI:* Hồ sơ đầu tư có sự lạc quan không gắn nhãn khiến hội đồng quyết định trên bằng chứng sai. Khách đầu tiên được hỏi về mức giá cao trở thành sự thật.
- **you gave advance board numbers to sales staff who passed them to outsiders** (severity 7): Board numbers are inside information until they are released. Passing them on, even to be friendly, moves from relationship management into something a regulator reads closely.
  - *VI:* Số liệu hội đồng là thông tin nội bộ cho đến khi được công bố. Chuyển chúng đi, dù để thân thiện, từ quản lý quan hệ thành điều cơ quan quản lý đọc rất kỹ.
- **you sent the bank an optimistic forecast described as the base case, and left out the downside** (severity 9): A forecast given to a lender is relied upon. Presenting an optimistic case as the base case, and leaving out the downside, moves from optimism into misrepresentation.
  - *VI:* Dự báo gửi cho bên cho vay được họ dựa vào. Trình bày kịch bản lạc quan là kịch bản cơ sở và bỏ kịch bản xấu là từ lạc quan chuyển sang khai man.
- **you told the board that a saving was confirmed by a manager who had confirmed nothing** (severity 8): Putting a colleague's name behind a number they never agreed to is a false statement to the board. It also tells that colleague what your numbers are worth.
  - *VI:* Gán tên đồng nghiệp sau một con số họ chưa từng đồng ý là phát biểu sai với hội đồng. Nó cũng cho đồng nghiệp đó biết số của bạn đáng giá bao nhiêu.
- **you moved invoices across the quarter end to improve a covenant ratio** (severity 7): Cut-off exists so that revenue and costs land in the period they belong to. Shifting an invoice by ten days to pass a test is window dressing, and suppliers keep their own statements.
  - *VI:* Cut-off tồn tại để doanh thu và chi phí rơi vào đúng kỳ. Dịch một hóa đơn mười ngày để qua một bài kiểm tra là tô vẽ báo cáo, và nhà cung cấp giữ sao kê của riêng họ.
- **you added an 'unallocated savings' line to make the budget reach a promised number** (severity 7): A plug is a number with nothing under it. It makes a budget say what was promised, and moves the miss to the first month that the plug is asked to appear.
  - *VI:* Số đệm là con số không có gì bên dưới. Nó làm ngân sách nói điều đã hứa và chuyển phần hụt sang tháng đầu tiên số đệm bị yêu cầu xuất hiện.
- **you left the revisions made to meet targets out of your own year-end review** (severity 3): A review without the awkward revisions rewards the wrong skill. The version history is a record, and your manager can read it.
  - *VI:* Một buổi đánh giá không có các lần sửa khó xử thưởng cho sai kỹ năng. Lịch sử phiên bản là hồ sơ, và sếp bạn đọc được nó.
- **you agreed budget numbers privately with department heads, with nothing written down** (severity 4): A budget made by phone calls is a budget nobody can explain. The next person to ask finds that everyone's number has a cushion and no one's has a reason.
  - *VI:* Ngân sách làm bằng các cuộc gọi là ngân sách không ai giải thích được. Người hỏi tiếp theo thấy số của ai cũng có lớp đệm và không số nào có lý do.
- **you published a KPI with its method and the alternative figure beside it** (severity 1): A KPI with its method can be argued with, and so it can be trusted. A single number with no method is easy to love and impossible to defend.
  - *VI:* Một KPI kèm phương pháp có thể được tranh luận, và vì vậy có thể được tin. Một con số duy nhất không có phương pháp dễ được yêu và không thể được bảo vệ.
- **you reclassified routine maintenance as capital expenditure to meet a bank covenant** (severity 7): Moving costs out of EBITDA to pass a covenant changes the number the bank relies on. The bank's lawyer will read the classification, and the accountant who signed it has her own copy.
  - *VI:* Chuyển chi phí ra khỏi EBITDA để qua điều khoản cam kết đổi con số ngân hàng dựa vào. Luật sư ngân hàng sẽ đọc cách phân loại, và kế toán đã ký có bản của riêng chị.
- **the records you rebuilt honestly** (severity 2): Clean records are boring, and that is the point: they let anyone audit you calmly.
  - *VI:* Hồ sơ sạch thì nhàm chán, và đó chính là mục đích: ai kiểm tra bạn cũng có thể bình tĩnh.
- **you changed a KPI definition and restated earlier months so that the trend looked better** (severity 5): Changing the definition is legitimate if it is announced, explained and shown both ways. Changing it quietly, with the history rewritten, is a way of improving a number without improving the factory.
  - *VI:* Đổi định nghĩa là chính đáng nếu được thông báo, giải thích và cho thấy cả hai cách. Đổi lặng lẽ, viết lại lịch sử, là cách cải thiện con số mà không cải thiện nhà máy.
- **you changed the overhead allocation for one product line only so that it showed a margin** (severity 5): A cost allocation that differs by whose product it is, is not a method. It moves cost to products that cannot argue, and decisions about them are then made on a lie.
  - *VI:* Phân bổ chi phí khác nhau tùy sản phẩm của ai không phải một phương pháp. Nó chuyển chi phí sang sản phẩm không cãi lại được, và các quyết định về chúng được đưa ra trên một điều sai.
- **you split one purchase into two requests to stay under the approval limit** (severity 5): An approval limit exists so that a second pair of eyes sees the large amounts. Splitting a purchase to stay under it is removing the eyes, and the test for it is easy to write.
  - *VI:* Hạn mức phê duyệt tồn tại để có một cặp mắt thứ hai nhìn các khoản lớn. Chia khoản mua để nằm dưới nó là bỏ cặp mắt đó, và phép kiểm tra rất dễ viết.
- **you told the internal auditor you did not recall details that you did** (severity 5): 'I do not recall' is a decision when it is not true. An auditor with a week and your server backups does not need your memory.
  - *VI:* 'Tôi không nhớ' là một quyết định khi nó không đúng. Một kiểm toán viên có một tuần và bản sao lưu máy chủ của bạn không cần trí nhớ của bạn.
- **you changed assumptions you could not defend so that a forecast cleared a limit** (severity 5): A forecast steered to a target is a wish with formulas. The version history keeps who changed what, and a forecast you cannot defend is worth less than none.
  - *VI:* Một dự báo bị lái về chỉ tiêu là một ước nguyện có công thức. Lịch sử phiên bản giữ ai đã đổi gì, và một dự báo bạn không bảo vệ nổi còn kém giá trị hơn không có.
- **you counted early-stage deals at a far higher probability than the history supports** (severity 5): A forecast weighted by hope is a plan for hiring and spending that the orders do not support. The shortfall arrives as a surprise, a quarter later, and the footnote says whose number it was.
  - *VI:* Dự báo gán trọng số bằng hy vọng là kế hoạch tuyển dụng và chi tiêu mà đơn hàng không hỗ trợ. Phần hụt đến như một bất ngờ, một quý sau, và chú thích nói số của ai.
