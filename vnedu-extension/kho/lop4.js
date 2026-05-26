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

  'Đạo đức_xuat_sac': [
    'Luôn thực hiện tốt nội quy, lễ phép với thầy cô, biết quan tâm và giúp đỡ bạn bè.',
    'Có ý thức kỷ luật tốt, thực hiện đúng các chuẩn mực đạo đức và ứng xử lịch sự.',
    'Ngoan ngoãn, chăm chỉ, biết vâng lời và có tinh thần trách nhiệm với công việc được giao.',
    'Thực hiện xuất sắc các yêu cầu môn Đạo đức, gương mẫu trong lớp và được bạn bè yêu quý.',
  ],
  'Đạo đức_tot': [
    'Có ý thức thực hiện nội quy, lễ phép với thầy cô và hòa đồng với bạn bè trong lớp.',
    'Thực hiện tốt các quy tắc ứng xử, biết giúp đỡ bạn và có ý thức giữ gìn vệ sinh.',
    'Ngoan ngoãn, có ý thức rèn luyện đạo đức và hoàn thành tốt nhiệm vụ được giao.',
    'Biết vâng lời thầy cô, thân thiện với bạn bè và có tinh thần đoàn kết tập thể.',
  ],
  'Đạo đức_hoan_thanh': [
    'Cơ bản thực hiện được các yêu cầu môn Đạo đức, cần rèn luyện thêm ý thức kỷ luật.',
    'Hoàn thành yêu cầu môn học, cần chú ý hơn trong việc thực hiện nội quy lớp học.',
  ],
  'Đạo đức_chua_hoan_thanh': [
    'Cần chú ý hơn trong việc thực hiện nội quy và rèn luyện các hành vi đạo đức.',
    'Cần cố gắng hơn trong việc giữ gìn kỷ luật và thực hiện đúng các quy tắc lớp học.',
  ],

  'Âm nhạc_xuat_sac': [
    'Có năng khiếu âm nhạc, hát đúng giai điệu, thuộc lời và thể hiện cảm xúc tốt qua bài hát.',
    'Cảm thụ âm nhạc tốt, hát đúng nhịp điệu và tích cực tham gia các hoạt động âm nhạc.',
    'Hát hay, đúng nhịp, biết vận động theo nhạc và thể hiện tốt trong các tiết học.',
    'Học tốt môn Âm nhạc, thuộc nhiều bài hát và biết gõ đệm theo nhịp, phách chính xác.',
  ],
  'Âm nhạc_tot': [
    'Hát đúng giai điệu, thuộc lời bài hát và tham gia tích cực các hoạt động âm nhạc.',
    'Có cảm nhận âm nhạc khá tốt, hát đúng nhịp và hoàn thành tốt các yêu cầu môn học.',
    'Thuộc các bài hát đã học, hát rõ lời và biết gõ đệm theo nhịp trong các tiết học.',
  ],
  'Âm nhạc_hoan_thanh': [
    'Hoàn thành các yêu cầu cơ bản môn Âm nhạc, cần luyện tập thêm để hát đúng và đều hơn.',
    'Đạt yêu cầu môn học, cần tích cực hơn trong các tiết học và luyện tập bài hát ở nhà.',
  ],
  'Âm nhạc_chua_hoan_thanh': [
    'Cần luyện tập thêm để hát đúng giai điệu và nhịp điệu theo yêu cầu môn Âm nhạc.',
    'Cần cố gắng hơn, chú ý nghe và luyện hát để đạt yêu cầu môn học.',
  ],

  'Mĩ thuật_xuat_sac': [
    'Có năng khiếu hội họa, vẽ đẹp, tô màu hài hòa và thể hiện sự sáng tạo trong từng bài vẽ.',
    'Sáng tạo trong các bài vẽ, biết phối màu hợp lý và trình bày bài sạch đẹp, ấn tượng.',
    'Vẽ đúng hình, tô màu đẹp và có ý tưởng sáng tạo độc đáo trong các bài học Mĩ thuật.',
    'Học tốt môn Mĩ thuật, các bài vẽ thể hiện sự quan sát tinh tế và óc thẩm mỹ tốt.',
  ],
  'Mĩ thuật_tot': [
    'Vẽ đúng yêu cầu, tô màu gọn gàng và có ý thức sáng tạo trong các bài học Mĩ thuật.',
    'Hoàn thành tốt các bài vẽ, biết phối màu và trình bày bài sạch sẽ, cẩn thận.',
    'Vẽ hình tương đối đúng, tô màu đẹp và hoàn thành bài tập đúng thời gian quy định.',
  ],
  'Mĩ thuật_hoan_thanh': [
    'Hoàn thành các bài vẽ theo yêu cầu, cần rèn thêm kỹ năng tô màu và sáng tạo.',
    'Đạt yêu cầu cơ bản môn Mĩ thuật, cần chú ý hơn trong việc vẽ hình và phối màu.',
  ],
  'Mĩ thuật_chua_hoan_thanh': [
    'Cần cố gắng hơn trong các bài vẽ, chú ý tô màu đúng và hoàn thành bài đúng hạn.',
    'Cần rèn luyện thêm kỹ năng vẽ và tô màu để đạt yêu cầu môn Mĩ thuật.',
  ],

  'GDTC_xuat_sac': [
    'Thể lực tốt, thực hiện đúng và đẹp các động tác thể dục, tích cực tham gia các hoạt động thể chất.',
    'Nhanh nhẹn, khéo léo, thực hiện tốt các bài tập thể dục và đạt kết quả cao trong kiểm tra.',
    'Có sức khỏe tốt, thực hiện chính xác các động tác và luôn hăng hái trong giờ Thể dục.',
    'Học tốt môn GDTC, thực hiện đúng kỹ thuật và có tinh thần tập luyện nghiêm túc.',
  ],
  'GDTC_tot': [
    'Thực hiện đúng các động tác thể dục, tích cực tham gia luyện tập và có tiến bộ rõ rệt.',
    'Hoàn thành tốt các bài tập thể dục, có ý thức rèn luyện thể chất thường xuyên.',
    'Tham gia tích cực giờ Thể dục, thực hiện đúng động tác và có sức khỏe tốt.',
  ],
  'GDTC_hoan_thanh': [
    'Hoàn thành các yêu cầu môn Thể dục, cần tích cực luyện tập thêm để nâng cao thể lực.',
    'Đạt yêu cầu cơ bản môn GDTC, cần chú ý hơn trong việc thực hiện đúng các động tác.',
  ],
  'GDTC_chua_hoan_thanh': [
    'Cần tích cực hơn trong giờ Thể dục, chú ý thực hiện đúng các động tác theo hướng dẫn.',
    'Cần cố gắng hơn, tích cực tham gia luyện tập để đạt yêu cầu môn học.',
  ],

  'HĐTN_xuat_sac': [
    'Tích cực tham gia các hoạt động trải nghiệm, sáng tạo và hợp tác tốt với bạn bè trong nhóm.',
    'Năng động, sáng tạo trong các hoạt động trải nghiệm, biết chia sẻ và hỗ trợ các bạn.',
    'Hăng hái tham gia mọi hoạt động, có nhiều ý tưởng sáng tạo và hoàn thành xuất sắc nhiệm vụ.',
    'Tích cực và chủ động trong các hoạt động trải nghiệm, thể hiện tinh thần đoàn kết tốt.',
  ],
  'HĐTN_tot': [
    'Tham gia tích cực các hoạt động trải nghiệm, biết hợp tác và hoàn thành tốt nhiệm vụ.',
    'Có ý thức tham gia hoạt động tập thể, biết chia sẻ và thể hiện sự sáng tạo trong các hoạt động.',
    'Hoàn thành tốt các yêu cầu môn HĐTN, tích cực tham gia và có tinh thần hợp tác tốt.',
  ],
  'HĐTN_hoan_thanh': [
    'Tham gia các hoạt động trải nghiệm đúng yêu cầu, cần chủ động và sáng tạo hơn.',
    'Hoàn thành yêu cầu môn HĐTN, cần tích cực hơn trong việc tham gia và đóng góp ý kiến.',
  ],
  'HĐTN_chua_hoan_thanh': [
    'Cần tích cực hơn trong các hoạt động trải nghiệm, chủ động tham gia và hợp tác với bạn bè.',
    'Cần cố gắng hơn, chú ý tham gia đầy đủ và hoàn thành nhiệm vụ được giao.',
  ],
};

if (typeof module !== 'undefined') module.exports = KHO_LOP4;
