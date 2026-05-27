// Kho nhận xét lớp 4 — thêm môn: Khoa học, Lịch sử & Địa lý, Tin học
const KHO_LOP4 = {
  'Tiếng Việt_xuat_sac': [
    'Đọc diễn cảm, hiểu sâu nội dung bài đọc, viết bài văn mạch lạc và dùng từ ngữ chính xác, sáng tạo.',
    'Có vốn từ phong phú, viết câu đúng ngữ pháp, biết dùng hình ảnh so sánh và nhân hóa trong bài viết.',
    'Nắm vững kiến thức Tiếng Việt, đọc hiểu tốt và viết bài văn có bố cục rõ ràng, diễn đạt hay.',
    'Đọc diễn cảm và hiểu ý nghĩa bài đọc, viết bài văn sáng tạo và trình bày sạch đẹp.',
    'Học tốt môn Tiếng Việt, biết phân tích nhân vật và viết bài văn kể chuyện sinh động, hấp dẫn.',
    'Tiếp thu nhanh, đọc trôi chảy và viết bài văn có ý tưởng sáng tạo, diễn đạt rõ ý, mạch lạc.',
  ],
  'Tiếng Việt_tot': [
    'Đọc đúng và tương đối diễn cảm, viết bài văn đúng yêu cầu và trình bày sạch sẽ.',
    'Nắm được kiến thức cơ bản, đọc hiểu bài và viết bài văn đúng chủ đề, rõ ý.',
    'Đọc và viết đạt yêu cầu, biết dùng từ phù hợp và hoàn thành tốt bài tập Tiếng Việt.',
    'Học tập tích cực, đọc khá tốt và viết bài văn đúng yêu cầu, có tiến bộ rõ rệt.',
    'Biết đọc hiểu bài và viết bài văn ngắn đúng yêu cầu, trình bày bài gọn gàng.',
  ],
  'Tiếng Việt_hoan_thanh': [
    'Đọc được bài tập đọc, viết bài văn cơ bản nhưng cần rèn thêm cách dùng từ và diễn đạt.',
    'Hoàn thành yêu cầu môn Tiếng Việt, cần luyện thêm đọc diễn cảm và viết bài văn.',
    'Cơ bản đạt yêu cầu, cần chú ý hơn trong việc viết đúng chính tả và diễn đạt rõ ý.',
    'Đọc và viết đạt mức cơ bản, cần cố gắng thêm để nâng cao kỹ năng Tiếng Việt.',
  ],
  'Tiếng Việt_chua_hoan_thanh': [
    'Cần luyện tập thêm kỹ năng đọc hiểu và viết bài văn, chú ý chính tả và dùng từ.',
    'Chưa đạt yêu cầu, cần được hỗ trợ thêm trong việc đọc hiểu và viết bài văn.',
    'Cần cố gắng hơn, chú ý luyện đọc và rèn viết chính tả mỗi ngày để tiến bộ hơn.',
  ],

  'Toán_xuat_sac': [
    'Thực hiện thành thạo các phép tính với số tự nhiên, phân số, giải toán nhanh và chính xác.',
    'Nắm vững kiến thức Toán lớp 4, tính toán đúng và biết vận dụng vào giải toán thực tế.',
    'Tư duy toán học tốt, làm bài chính xác và biết giải các bài toán liên quan đến diện tích, chu vi.',
    'Hiểu sâu các dạng toán, giải bài nhanh và đúng, có khả năng tư duy logic xuất sắc.',
    'Nắm chắc kiến thức về phân số và số thập phân, giải toán có lời văn rõ ràng và khoa học.',
    'Học tốt môn Toán, làm bài cẩn thận và biết vận dụng kiến thức vào các bài toán thực tế.',
  ],
  'Toán_tot': [
    'Thực hiện đúng các phép tính, giải được toán có lời văn và trình bày lời giải rõ ràng.',
    'Nắm được kiến thức Toán, làm bài đúng yêu cầu và có tiến bộ trong học kỳ.',
    'Tính toán khá chính xác, biết giải toán và hoàn thành bài tập đầy đủ, đúng hạn.',
    'Hiểu bài và làm đúng các dạng toán cơ bản, cần rèn thêm tốc độ tính toán.',
    'Học tốt môn Toán, làm bài cẩn thận và hoàn thành đúng thời gian quy định.',
  ],
  'Toán_hoan_thanh': [
    'Thực hiện được các phép tính cơ bản, cần luyện thêm để giải toán có lời văn đúng hơn.',
    'Hoàn thành yêu cầu môn Toán, cần chú ý hơn trong việc đọc đề và trình bày lời giải.',
    'Cơ bản nắm được kiến thức, cần cố gắng thêm để tính toán nhanh và chính xác hơn.',
    'Đạt yêu cầu cơ bản, cần rèn luyện thêm để nâng cao kết quả học tập môn Toán.',
  ],
  'Toán_chua_hoan_thanh': [
    'Cần ôn luyện thêm các phép tính và cách giải toán có lời văn, chú ý rèn luyện mỗi ngày.',
    'Chưa nắm vững kiến thức Toán, cần được hỗ trợ thêm và luyện tập thường xuyên.',
    'Cần cố gắng hơn, chú ý nghe giảng và hoàn thành đầy đủ bài tập về nhà.',
  ],

  'Khoa học_xuat_sac': [
    'Nắm vững kiến thức Khoa học, biết giải thích các hiện tượng tự nhiên và vận dụng vào thực tế.',
    'Có tư duy khoa học tốt, biết quan sát, thí nghiệm và rút ra kết luận chính xác.',
    'Học tốt môn Khoa học, hiểu sâu về vật chất, năng lượng và môi trường sống xung quanh.',
    'Tích cực tìm hiểu, có nhiều hiểu biết về khoa học tự nhiên và biết liên hệ với thực tế.',
    'Nắm chắc kiến thức, biết phân tích và giải thích các hiện tượng khoa học một cách rõ ràng.',
  ],
  'Khoa học_tot': [
    'Nắm được kiến thức cơ bản môn Khoa học, biết vận dụng vào giải thích các hiện tượng đơn giản.',
    'Tích cực tham gia các hoạt động thí nghiệm, hiểu bài và trả lời câu hỏi khá tốt.',
    'Học tốt môn Khoa học, biết liên hệ kiến thức với cuộc sống và hoàn thành tốt bài tập.',
    'Hiểu bài và nắm được các kiến thức cơ bản, có ý thức tìm hiểu thêm về khoa học.',
  ],
  'Khoa học_hoan_thanh': [
    'Nắm được kiến thức cơ bản môn Khoa học, cần tích cực hơn trong việc liên hệ thực tế.',
    'Hoàn thành yêu cầu môn học, cần chú ý hơn trong giờ học và tích cực phát biểu ý kiến.',
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để hiểu sâu hơn về các kiến thức khoa học.',
  ],
  'Khoa học_chua_hoan_thanh': [
    'Cần chú ý hơn trong giờ học Khoa học, tích cực quan sát và ghi nhớ kiến thức bài học.',
    'Cần cố gắng hơn, chú ý lắng nghe và tham gia tích cực các hoạt động học tập.',
  ],

  'Lịch sử & Địa lý_xuat_sac': [
    'Nắm vững kiến thức Lịch sử và Địa lý, biết phân tích sự kiện và liên hệ với thực tế.',
    'Có hiểu biết sâu rộng về lịch sử dân tộc và địa lý đất nước, trình bày rõ ràng, mạch lạc.',
    'Học tốt môn Lịch sử & Địa lý, biết đọc bản đồ và nắm chắc các sự kiện lịch sử quan trọng.',
    'Tích cực tìm hiểu, có nhiều hiểu biết về lịch sử và địa lý Việt Nam, trình bày tự tin.',
    'Nắm chắc kiến thức, biết phân tích và trình bày các sự kiện lịch sử một cách rõ ràng.',
  ],
  'Lịch sử & Địa lý_tot': [
    'Nắm được kiến thức cơ bản về lịch sử và địa lý, biết liên hệ với thực tế cuộc sống.',
    'Tích cực tham gia học tập, hiểu bài và trả lời câu hỏi về lịch sử và địa lý khá tốt.',
    'Học tốt môn Lịch sử & Địa lý, biết đọc bản đồ và nắm được các sự kiện cơ bản.',
    'Hiểu bài và nắm được kiến thức cơ bản, có ý thức tìm hiểu thêm về lịch sử đất nước.',
  ],
  'Lịch sử & Địa lý_hoan_thanh': [
    'Nắm được kiến thức cơ bản, cần tích cực hơn trong việc tìm hiểu lịch sử và địa lý.',
    'Hoàn thành yêu cầu môn học, cần chú ý hơn trong giờ học và ghi nhớ các sự kiện quan trọng.',
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để hiểu sâu hơn về lịch sử và địa lý Việt Nam.',
  ],
  'Lịch sử & Địa lý_chua_hoan_thanh': [
    'Cần chú ý hơn trong giờ học, tích cực ghi nhớ các sự kiện lịch sử và kiến thức địa lý.',
    'Cần cố gắng hơn, chú ý lắng nghe và hoàn thành đầy đủ bài tập môn học.',
  ],

  'Tin học_xuat_sac': [
    'Thành thạo các thao tác máy tính, biết sử dụng phần mềm học tập và hoàn thành xuất sắc bài tập.',
    'Có tư duy logic tốt, nắm vững kiến thức Tin học và biết vận dụng vào thực hành hiệu quả.',
    'Học tốt môn Tin học, thực hành thành thạo và có khả năng tự học, tự khám phá phần mềm mới.',
    'Nắm chắc kiến thức, thực hành nhanh và chính xác, luôn hoàn thành bài tập trước thời gian.',
    'Tích cực học tập, có nhiều sáng tạo trong thực hành và hỗ trợ tốt các bạn trong lớp.',
  ],
  'Tin học_tot': [
    'Nắm được kiến thức cơ bản môn Tin học, thực hành đúng yêu cầu và hoàn thành tốt bài tập.',
    'Thực hiện đúng các thao tác máy tính, biết sử dụng phần mềm cơ bản và hoàn thành bài tập.',
    'Học tốt môn Tin học, thực hành khá thành thạo và có tiến bộ rõ rệt trong học kỳ.',
    'Hiểu bài và thực hành đúng yêu cầu, có ý thức học tập và hoàn thành bài tập đầy đủ.',
  ],
  'Tin học_hoan_thanh': [
    'Nắm được kiến thức cơ bản, cần luyện tập thêm để thực hành thành thạo hơn.',
    'Hoàn thành yêu cầu môn Tin học, cần chú ý hơn trong giờ thực hành và luyện tập thêm.',
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để thực hành nhanh và chính xác hơn.',
  ],
  'Tin học_chua_hoan_thanh': [
    'Cần chú ý hơn trong giờ học Tin học, tích cực thực hành và ghi nhớ các thao tác cơ bản.',
    'Cần cố gắng hơn, chú ý lắng nghe và luyện tập thực hành để đạt yêu cầu môn học.',
  ],
};

if (typeof module !== 'undefined') module.exports = KHO_LOP4;
