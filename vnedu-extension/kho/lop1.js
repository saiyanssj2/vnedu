// Kho nhận xét lớp 1
const KHO_LOP1 = {
  'Tiếng Việt_xuat_sac': [
    'Đọc trơn tru, viết đúng mẫu chữ, nắm chắc các âm vần và hoàn thành xuất sắc các bài tập Tiếng Việt.',
    'Nhận biết và đọc đúng các âm vần đã học, viết chữ đẹp và trình bày bài sạch sẽ, cẩn thận.',
    'Đọc thành thạo các bài tập đọc, viết đúng chính tả và có ý thức luyện chữ viết rất tốt.',
    'Nắm vững các âm vần, đọc rõ ràng lưu loát và viết đúng mẫu chữ quy định.',
    'Tiếp thu nhanh các âm vần mới, đọc trôi chảy và viết chữ đúng mẫu, sạch đẹp.',
    'Học tốt môn Tiếng Việt, đọc đúng và viết đẹp, hoàn thành xuất sắc các yêu cầu của lớp 1.',
  ],
  'Tiếng Việt_tot': [
    'Đọc đúng các âm vần đã học, viết chữ tương đối đẹp và hoàn thành tốt bài tập được giao.',
    'Nắm được các âm vần cơ bản, đọc rõ ràng và viết đúng chính tả trong các bài học.',
    'Đọc và viết đạt yêu cầu, có cố gắng luyện chữ và hoàn thành bài tập đầy đủ.',
    'Biết đọc các bài tập đọc ngắn, viết đúng mẫu và trình bày bài viết gọn gàng.',
    'Học tập tích cực, đọc đúng và viết khá đẹp, có tiến bộ rõ rệt trong học kỳ.',
  ],
  'Tiếng Việt_hoan_thanh': [
    'Đọc được các âm vần cơ bản, viết đúng nhưng cần rèn thêm tốc độ và sự cẩn thận.',
    'Hoàn thành các yêu cầu cơ bản môn Tiếng Việt, cần luyện thêm chữ viết và chính tả.',
    'Đọc và viết đạt mức cơ bản, cần chú ý hơn trong việc luyện đọc và rèn chữ viết.',
    'Cơ bản nắm được các âm vần, cần cố gắng thêm để đọc trôi chảy và viết đẹp hơn.',
  ],
  'Tiếng Việt_chua_hoan_thanh': [
    'Cần luyện tập thêm để đọc đúng các âm vần và viết đúng mẫu chữ theo yêu cầu.',
    'Chưa đọc thành thạo, cần được hỗ trợ thêm trong việc nhận biết âm vần và luyện viết.',
    'Cần cố gắng hơn trong học Tiếng Việt, chú ý luyện đọc và rèn chữ viết mỗi ngày.',
  ],

  'Toán_xuat_sac': [
    'Thực hiện thành thạo các phép tính trong phạm vi đã học, giải toán nhanh và chính xác.',
    'Nắm vững các số và phép tính, làm bài đúng và nhanh, có tư duy toán học tốt.',
    'Tính toán chính xác, nhận biết tốt các hình học cơ bản và hoàn thành xuất sắc bài tập Toán.',
    'Hiểu sâu kiến thức Toán lớp 1, vận dụng linh hoạt vào giải các bài toán có lời văn.',
    'Làm tính đúng, nhanh và biết giải toán có lời văn rõ ràng, trình bày sạch đẹp.',
    'Nắm chắc các phép cộng trừ trong phạm vi đã học, tư duy logic tốt và làm bài cẩn thận.',
  ],
  'Toán_tot': [
    'Thực hiện đúng các phép tính cơ bản, hoàn thành tốt bài tập và có tiến bộ trong học kỳ.',
    'Nắm được các số và phép tính đã học, làm bài đúng yêu cầu và trình bày rõ ràng.',
    'Tính toán khá chính xác, biết giải toán đơn giản và hoàn thành bài tập đầy đủ.',
    'Hiểu bài và làm đúng các dạng toán cơ bản, cần rèn thêm tốc độ tính toán.',
    'Học tốt môn Toán, làm bài cẩn thận và có ý thức kiểm tra lại kết quả.',
  ],
  'Toán_hoan_thanh': [
    'Thực hiện được các phép tính cơ bản, cần luyện thêm để tính nhanh và chính xác hơn.',
    'Hoàn thành yêu cầu môn Toán, cần chú ý hơn trong việc đọc đề và trình bày bài.',
    'Cơ bản nắm được các phép tính, cần cố gắng thêm để làm bài đúng và nhanh hơn.',
    'Đạt yêu cầu cơ bản môn Toán, cần rèn luyện thêm để nâng cao kết quả học tập.',
  ],
  'Toán_chua_hoan_thanh': [
    'Cần ôn luyện thêm các phép tính cơ bản, chú ý rèn luyện mỗi ngày để tiến bộ hơn.',
    'Chưa nắm vững các phép tính, cần được hỗ trợ thêm và luyện tập thường xuyên.',
    'Cần cố gắng hơn trong học Toán, chú ý nghe giảng và hoàn thành đầy đủ bài tập.',
  ],

  'Đạo đức_xuat_sac': [
    'Luôn thực hiện tốt nội quy lớp học, lễ phép với thầy cô và thân thiện với bạn bè.',
    'Có ý thức kỷ luật tốt, biết giúp đỡ bạn bè và thực hiện đúng các quy tắc ứng xử.',
    'Ngoan ngoãn, lễ phép, biết vâng lời thầy cô và có tinh thần đoàn kết với bạn bè.',
    'Thực hiện xuất sắc các yêu cầu môn Đạo đức, có hành vi ứng xử đúng mực và gương mẫu.',
    'Luôn giữ gìn vệ sinh, bảo vệ của công và có ý thức xây dựng tập thể lớp tốt.',
  ],
  'Đạo đức_tot': [
    'Có ý thức thực hiện nội quy lớp học, lễ phép với thầy cô và hòa đồng với bạn bè.',
    'Thực hiện tốt các quy tắc ứng xử, biết quan tâm giúp đỡ bạn và giữ gìn vệ sinh.',
    'Ngoan ngoãn, chăm chỉ và có ý thức rèn luyện đạo đức theo yêu cầu của lớp.',
    'Biết vâng lời thầy cô, thân thiện với bạn bè và hoàn thành tốt nhiệm vụ được giao.',
  ],
  'Đạo đức_hoan_thanh': [
    'Cơ bản thực hiện được các yêu cầu môn Đạo đức, cần rèn luyện thêm ý thức kỷ luật.',
    'Hoàn thành yêu cầu môn học, cần chú ý hơn trong việc giữ gìn vệ sinh và nội quy lớp.',
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để thực hiện tốt hơn các quy tắc ứng xử.',
  ],
  'Đạo đức_chua_hoan_thanh': [
    'Cần chú ý hơn trong việc thực hiện nội quy và rèn luyện các hành vi đạo đức.',
    'Cần cố gắng hơn trong việc giữ gìn kỷ luật và thực hiện đúng các quy tắc lớp học.',
  ],

  'TN-XH_xuat_sac': [
    'Có hiểu biết phong phú về tự nhiên và xã hội, biết quan sát và trả lời câu hỏi rõ ràng.',
    'Nắm vững kiến thức TN-XH, biết liên hệ thực tế và trình bày những điều quan sát được.',
    'Tích cực khám phá, có nhiều hiểu biết về môi trường xung quanh và học tập xuất sắc.',
    'Hiểu biết tốt về bản thân, gia đình và trường học, biết vận dụng kiến thức vào thực tế.',
    'Học tốt môn TN-XH, biết quan sát, nhận xét và chia sẻ hiểu biết một cách tự tin.',
  ],
  'TN-XH_tot': [
    'Nắm được các kiến thức cơ bản về tự nhiên xã hội, biết vận dụng vào thực tế cuộc sống.',
    'Tích cực tham gia các hoạt động khám phá, nắm được nội dung bài học và trình bày khá rõ.',
    'Hiểu bài và trả lời được các câu hỏi cơ bản, có ý thức quan sát môi trường xung quanh.',
    'Học tốt môn TN-XH, biết liên hệ kiến thức với cuộc sống và hoàn thành tốt bài tập.',
  ],
  'TN-XH_hoan_thanh': [
    'Nắm được kiến thức cơ bản môn TN-XH, cần tích cực quan sát và liên hệ thực tế hơn.',
    'Hoàn thành yêu cầu môn học, cần chú ý hơn trong giờ học và tích cực phát biểu.',
    'Đạt yêu cầu cơ bản, cần cố gắng thêm để hiểu sâu hơn về tự nhiên và xã hội.',
  ],
  'TN-XH_chua_hoan_thanh': [
    'Cần chú ý hơn trong giờ học TN-XH, tích cực quan sát và ghi nhớ kiến thức bài học.',
    'Cần cố gắng hơn, chú ý lắng nghe và tham gia tích cực các hoạt động học tập.',
  ],

  'Âm nhạc_xuat_sac': [
    'Có năng khiếu âm nhạc, hát đúng giai điệu, thuộc lời và thể hiện cảm xúc tốt qua bài hát.',
    'Cảm thụ âm nhạc tốt, hát đúng nhịp điệu và tích cực tham gia các hoạt động âm nhạc.',
    'Hát hay, đúng nhịp và biết vận động theo nhạc một cách tự nhiên, sinh động.',
    'Học tốt môn Âm nhạc, thuộc nhiều bài hát và thể hiện tốt trong các hoạt động văn nghệ.',
    'Có giọng hát tốt, hát đúng giai điệu và luôn hăng hái tham gia các tiết học âm nhạc.',
  ],
  'Âm nhạc_tot': [
    'Hát đúng giai điệu, thuộc lời bài hát và tham gia tích cực các hoạt động âm nhạc.',
    'Có cảm nhận âm nhạc khá tốt, hát đúng nhịp và hoàn thành tốt các yêu cầu môn học.',
    'Thuộc các bài hát đã học, hát rõ lời và tích cực tham gia hoạt động văn nghệ lớp.',
    'Học tốt môn Âm nhạc, biết vận động theo nhạc và hoàn thành tốt bài tập được giao.',
  ],
  'Âm nhạc_hoan_thanh': [
    'Hoàn thành các yêu cầu cơ bản môn Âm nhạc, cần luyện tập thêm để hát đúng và đều hơn.',
    'Thuộc bài hát cơ bản, cần rèn thêm để hát đúng nhịp điệu và thể hiện cảm xúc tốt hơn.',
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
    'Tham gia tích cực các hoạt động trải nghiệm, biết hợp tác và hoàn thành tốt nhiệm vụ được giao.',
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

if (typeof module !== 'undefined') module.exports = KHO_LOP1;
