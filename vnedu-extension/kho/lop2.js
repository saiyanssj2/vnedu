// Kho nhận xét lớp 2
const KHO_LOP2 = {
  'Tiếng Việt_xuat_sac': [
    'Đọc lưu loát, diễn cảm các bài tập đọc, viết đúng chính tả và đặt câu hay, rõ ý.',
    'Có vốn từ phong phú, viết câu đúng ngữ pháp và trình bày bài viết rõ ràng, sạch đẹp.',
    'Nắm vững kiến thức Tiếng Việt lớp 2, đọc hiểu tốt và viết bài có bố cục rõ ràng.',
    'Đọc diễn cảm, viết chính tả đúng và biết dùng từ phù hợp khi đặt câu, viết đoạn văn.',
    'Học tốt môn Tiếng Việt, đọc đúng ngữ điệu và viết bài văn ngắn mạch lạc, rõ ý.',
    'Tiếp thu nhanh, đọc trôi chảy và viết đúng chính tả, biết đặt câu đúng mẫu câu đã học.',
  ],
  'Tiếng Việt_tot': [
    'Đọc đúng và tương đối diễn cảm, viết chính tả ít lỗi và đặt câu đúng yêu cầu.',
    'Nắm được kiến thức cơ bản, đọc rõ ràng và viết bài đúng chính tả, trình bày sạch.',
    'Đọc và viết đạt yêu cầu, biết đặt câu theo mẫu và hoàn thành tốt bài tập Tiếng Việt.',
    'Học tập tích cực, đọc khá tốt và viết đúng chính tả, có tiến bộ trong học kỳ.',
    'Biết đọc hiểu bài và viết đoạn văn ngắn đúng yêu cầu, trình bày bài gọn gàng.',
  ],
  'Tiếng Việt_hoan_thanh': [
    'Đọc được bài tập đọc, viết đúng chính tả cơ bản nhưng cần rèn thêm cách đặt câu.',
    'Hoàn thành yêu cầu môn Tiếng Việt, cần luyện thêm đọc diễn cảm và viết đoạn văn.',
    'Cơ bản đạt yêu cầu, cần chú ý hơn trong việc viết đúng chính tả và đặt câu đúng mẫu.',
    'Đọc và viết đạt mức cơ bản, cần cố gắng thêm để nâng cao kỹ năng Tiếng Việt.',
  ],
  'Tiếng Việt_chua_hoan_thanh': [
    'Cần luyện tập thêm kỹ năng đọc và viết, chú ý chính tả và cách đặt câu đúng mẫu.',
    'Chưa đạt yêu cầu, cần được hỗ trợ thêm trong việc đọc hiểu và viết đúng chính tả.',
    'Cần cố gắng hơn, chú ý luyện đọc và rèn viết chính tả mỗi ngày để tiến bộ hơn.',
  ],

  'Toán_xuat_sac': [
    'Thực hiện thành thạo các phép tính, giải toán có lời văn nhanh và chính xác.',
    'Nắm vững kiến thức Toán lớp 2, tính toán đúng và biết vận dụng vào giải toán thực tế.',
    'Tư duy toán học tốt, làm bài chính xác và trình bày lời giải rõ ràng, khoa học.',
    'Hiểu sâu các dạng toán, giải bài nhanh và đúng, có khả năng tư duy logic tốt.',
    'Nắm chắc bảng nhân chia, thực hiện phép tính đúng và giải toán có lời văn rõ ràng.',
    'Học tốt môn Toán, làm bài cẩn thận và biết kiểm tra lại kết quả sau khi làm xong.',
  ],
  'Toán_tot': [
    'Thực hiện đúng các phép tính cơ bản, giải được toán có lời văn và trình bày rõ ràng.',
    'Nắm được kiến thức Toán, làm bài đúng yêu cầu và có tiến bộ trong học kỳ.',
    'Tính toán khá chính xác, biết giải toán đơn giản và hoàn thành bài tập đầy đủ.',
    'Hiểu bài và làm đúng các dạng toán cơ bản, cần rèn thêm tốc độ tính toán.',
    'Học tốt môn Toán, làm bài cẩn thận và hoàn thành đúng thời gian quy định.',
  ],
  'Toán_hoan_thanh': [
    'Thực hiện được các phép tính cơ bản, cần luyện thêm để tính nhanh và chính xác hơn.',
    'Hoàn thành yêu cầu môn Toán, cần chú ý hơn trong việc đọc đề và trình bày lời giải.',
    'Cơ bản nắm được kiến thức, cần cố gắng thêm để giải toán có lời văn đúng hơn.',
    'Đạt yêu cầu cơ bản, cần rèn luyện thêm bảng nhân chia để tính toán nhanh hơn.',
  ],
  'Toán_chua_hoan_thanh': [
    'Cần ôn luyện thêm các phép tính và bảng nhân chia, chú ý rèn luyện mỗi ngày.',
    'Chưa nắm vững kiến thức Toán, cần được hỗ trợ thêm và luyện tập thường xuyên.',
    'Cần cố gắng hơn, chú ý nghe giảng và hoàn thành đầy đủ bài tập về nhà.',
  ],

  'Đạo đức_xuat_sac': [
    'Luôn thực hiện tốt nội quy, lễ phép với thầy cô, biết quan tâm và giúp đỡ bạn bè.',
    'Có ý thức kỷ luật tốt, thực hiện đúng các chuẩn mực đạo đức và ứng xử lịch sự.',
    'Ngoan ngoãn, chăm chỉ, biết vâng lời và có tinh thần trách nhiệm với công việc được giao.',
    'Thực hiện xuất sắc các yêu cầu môn Đạo đức, gương mẫu trong lớp và được bạn bè yêu quý.',
    'Có hành vi đạo đức tốt, biết bảo vệ môi trường và có ý thức giữ gìn của công.',
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
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để thực hiện tốt hơn các quy tắc ứng xử.',
  ],
  'Đạo đức_chua_hoan_thanh': [
    'Cần chú ý hơn trong việc thực hiện nội quy và rèn luyện các hành vi đạo đức.',
    'Cần cố gắng hơn trong việc giữ gìn kỷ luật và thực hiện đúng các quy tắc lớp học.',
  ],

  'TN-XH_xuat_sac': [
    'Có hiểu biết phong phú về tự nhiên và xã hội, biết quan sát và giải thích các hiện tượng.',
    'Nắm vững kiến thức TN-XH, biết liên hệ thực tế và trình bày rõ ràng những điều quan sát.',
    'Tích cực khám phá, có nhiều hiểu biết về cơ thể người, gia đình và cộng đồng xung quanh.',
    'Học tốt môn TN-XH, biết quan sát, nhận xét và chia sẻ hiểu biết một cách tự tin, rõ ràng.',
    'Hiểu biết tốt về sức khỏe, môi trường và xã hội, biết vận dụng kiến thức vào cuộc sống.',
  ],
  'TN-XH_tot': [
    'Nắm được kiến thức cơ bản về tự nhiên xã hội, biết vận dụng vào thực tế cuộc sống.',
    'Tích cực tham gia các hoạt động khám phá, nắm được nội dung bài học và trình bày khá rõ.',
    'Hiểu bài và trả lời được các câu hỏi, có ý thức quan sát và tìm hiểu môi trường xung quanh.',
    'Học tốt môn TN-XH, biết liên hệ kiến thức với cuộc sống và hoàn thành tốt bài tập.',
  ],
  'TN-XH_hoan_thanh': [
    'Nắm được kiến thức cơ bản, cần tích cực quan sát và liên hệ thực tế hơn trong học tập.',
    'Hoàn thành yêu cầu môn học, cần chú ý hơn trong giờ học và tích cực phát biểu ý kiến.',
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để hiểu sâu hơn về tự nhiên và xã hội.',
  ],
  'TN-XH_chua_hoan_thanh': [
    'Cần chú ý hơn trong giờ học TN-XH, tích cực quan sát và ghi nhớ kiến thức bài học.',
    'Cần cố gắng hơn, chú ý lắng nghe và tham gia tích cực các hoạt động học tập.',
  ],

  'Âm nhạc_xuat_sac': [
    'Có năng khiếu âm nhạc, hát đúng giai điệu, thuộc lời và thể hiện cảm xúc tốt qua bài hát.',
    'Cảm thụ âm nhạc tốt, hát đúng nhịp điệu và tích cực tham gia các hoạt động âm nhạc.',
    'Hát hay, đúng nhịp, biết vận động theo nhạc và thể hiện tốt trong các tiết học.',
    'Học tốt môn Âm nhạc, thuộc nhiều bài hát và biết gõ đệm theo nhịp, phách chính xác.',
    'Có giọng hát tốt, hát đúng giai điệu và luôn hăng hái tham gia các tiết học âm nhạc.',
  ],
  'Âm nhạc_tot': [
    'Hát đúng giai điệu, thuộc lời bài hát và tham gia tích cực các hoạt động âm nhạc.',
    'Có cảm nhận âm nhạc khá tốt, hát đúng nhịp và hoàn thành tốt các yêu cầu môn học.',
    'Thuộc các bài hát đã học, hát rõ lời và biết gõ đệm theo nhịp trong các tiết học.',
    'Học tốt môn Âm nhạc, biết vận động theo nhạc và hoàn thành tốt bài tập được giao.',
  ],
  'Âm nhạc_hoan_thanh': [
    'Hoàn thành các yêu cầu cơ bản môn Âm nhạc, cần luyện tập thêm để hát đúng và đều hơn.',
    'Thuộc bài hát cơ bản, cần rèn thêm để hát đúng nhịp điệu và gõ đệm chính xác hơn.',
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
    'Có khiếu thẩm mỹ, vẽ hình cân đối và tô màu sáng tạo, bài vẽ luôn đẹp và ấn tượng.',
  ],
  'Mĩ thuật_tot': [
    'Vẽ đúng yêu cầu, tô màu gọn gàng và có ý thức sáng tạo trong các bài học Mĩ thuật.',
    'Hoàn thành tốt các bài vẽ, biết phối màu và trình bày bài sạch sẽ, cẩn thận.',
    'Vẽ hình tương đối đúng, tô màu đẹp và hoàn thành bài tập đúng thời gian quy định.',
    'Học tốt môn Mĩ thuật, có ý thức sáng tạo và luôn cố gắng hoàn thiện bài vẽ.',
  ],
  'Mĩ thuật_hoan_thanh': [
    'Hoàn thành các bài vẽ theo yêu cầu, cần rèn thêm kỹ năng tô màu và sáng tạo.',
    'Đạt yêu cầu cơ bản môn Mĩ thuật, cần chú ý hơn trong việc vẽ hình và phối màu.',
    'Cơ bản hoàn thành bài vẽ, cần cố gắng thêm để vẽ đẹp và tô màu đều hơn.',
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
    'Nhanh nhẹn, hoạt bát, thực hiện tốt các bài tập và có ý thức rèn luyện thể chất.',
  ],
  'GDTC_tot': [
    'Thực hiện đúng các động tác thể dục, tích cực tham gia luyện tập và có tiến bộ rõ rệt.',
    'Hoàn thành tốt các bài tập thể dục, có ý thức rèn luyện thể chất thường xuyên.',
    'Tham gia tích cực giờ Thể dục, thực hiện đúng động tác và có sức khỏe tốt.',
    'Học tốt môn GDTC, biết thực hiện các bài tập đúng kỹ thuật và hoàn thành đầy đủ.',
  ],
  'GDTC_hoan_thanh': [
    'Hoàn thành các yêu cầu môn Thể dục, cần tích cực luyện tập thêm để nâng cao thể lực.',
    'Đạt yêu cầu cơ bản môn GDTC, cần chú ý hơn trong việc thực hiện đúng các động tác.',
    'Cơ bản hoàn thành bài tập thể dục, cần cố gắng thêm để thực hiện đúng và đẹp hơn.',
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
    'Học tốt môn HĐTN, luôn nhiệt tình tham gia và có đóng góp tích cực cho tập thể lớp.',
  ],
  'HĐTN_tot': [
    'Tham gia tích cực các hoạt động trải nghiệm, biết hợp tác và hoàn thành tốt nhiệm vụ.',
    'Có ý thức tham gia hoạt động tập thể, biết chia sẻ và thể hiện sự sáng tạo trong các hoạt động.',
    'Hoàn thành tốt các yêu cầu môn HĐTN, tích cực tham gia và có tinh thần hợp tác tốt.',
    'Tham gia đầy đủ các hoạt động trải nghiệm, có ý thức xây dựng tập thể và giúp đỡ bạn bè.',
  ],
  'HĐTN_hoan_thanh': [
    'Tham gia các hoạt động trải nghiệm đúng yêu cầu, cần chủ động và sáng tạo hơn.',
    'Hoàn thành yêu cầu môn HĐTN, cần tích cực hơn trong việc tham gia và đóng góp ý kiến.',
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để chủ động hơn trong các hoạt động tập thể.',
  ],
  'HĐTN_chua_hoan_thanh': [
    'Cần tích cực hơn trong các hoạt động trải nghiệm, chủ động tham gia và hợp tác với bạn bè.',
    'Cần cố gắng hơn, chú ý tham gia đầy đủ và hoàn thành nhiệm vụ được giao.',
  ],
};

if (typeof module !== 'undefined') module.exports = KHO_LOP2;
