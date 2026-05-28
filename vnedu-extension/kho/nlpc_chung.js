// Kho nhận xét Phẩm chất - Năng lực ghi học bạ
// Dùng chung lớp 1-3, mỗi nhận xét < 47 ký tự
// Cấu trúc: field: { T: [...], D: [...], C: [...] }

const KHO_NLPC = {

  nl_chung: {
    T: [
      'Tự giác học tập, hợp tác xuất sắc.',
      'Chủ động học bài, hỗ trợ bạn rất tốt.',
      'Tích cực học tập, làm việc nhóm xuất sắc.',
      'Hoàn thành xuất sắc nhiệm vụ được giao.',
      'Tự quản tốt, phối hợp nhóm rất hiệu quả.',
    ],
    D: [
      'Tự giác học tập, hợp tác tốt với bạn.',
      'Chủ động học bài, biết hỗ trợ bạn bè.',
      'Tích cực học tập, làm việc nhóm tốt.',
      'Hoàn thành tốt nhiệm vụ được giao.',
      'Biết lắng nghe và hợp tác với bạn bè.',
    ],
    C: [
      'Cần tự giác học tập và hợp tác hơn.',
      'Cần chủ động hơn trong học tập.',
      'Cần tích cực tham gia hoạt động nhóm.',
      'Cần cố gắng hoàn thành nhiệm vụ hơn.',
      'Cần rèn tính tự giác trong học tập.',
    ],
  },

  pc_chung: {
    T: [
      'Ngoan, lễ phép, gương mẫu trong lớp.',
      'Chăm chỉ, trung thực, đoàn kết bạn bè.',
      'Có ý thức kỷ luật tốt, gương mẫu.',
      'Yêu trường lớp, chăm chỉ, trách nhiệm.',
      'Lễ phép với thầy cô, thân thiện bạn bè.',
    ],
    D: [
      'Ngoan, lễ phép, đoàn kết với bạn bè.',
      'Chăm chỉ, trung thực, yêu thương bạn.',
      'Có ý thức kỷ luật, quan tâm bạn bè.',
      'Yêu trường lớp, chăm chỉ học tập.',
      'Lễ phép, biết giữ gìn của công.',
    ],
    C: [
      'Cần ngoan và lễ phép hơn với thầy cô.',
      'Cần chăm chỉ và trung thực hơn.',
      'Cần có ý thức kỷ luật tốt hơn.',
      'Cần yêu thương bạn bè và đoàn kết hơn.',
      'Cần rèn luyện phẩm chất tốt hơn.',
    ],
  },

  tu_chu: {
    T: [
      'Rất tự giác học bài, không cần nhắc.',
      'Tự sắp xếp việc học rất khoa học.',
      'Chủ động ôn bài, hoàn thành xuất sắc.',
      'Tự học rất tốt, biết điều chỉnh cách học.',
      'Kiên trì luyện tập, không nản khi khó.',
    ],
    D: [
      'Tự giác học bài, hoàn thành tốt bài tập.',
      'Biết tự sắp xếp việc học hợp lý.',
      'Chủ động ôn bài, ít cần nhắc nhở.',
      'Tự học tốt, biết điều chỉnh cách học.',
      'Kiên trì luyện tập, tự hoàn thành bài.',
    ],
    C: [
      'Cần tự giác học bài hơn.',
      'Cần tự sắp xếp việc học khoa học hơn.',
      'Cần chủ động ôn bài, không chờ nhắc.',
      'Cần rèn tính tự học, không ỷ lại bạn.',
      'Cần kiên trì hơn khi gặp bài khó.',
    ],
  },

  giao_tiep: {
    T: [
      'Giao tiếp lịch sự, hợp tác xuất sắc.',
      'Biết lắng nghe và chia sẻ rất tốt.',
      'Tự tin phát biểu, làm việc nhóm xuất sắc.',
      'Trình bày ý kiến rõ ràng, mạch lạc.',
      'Hợp tác xuất sắc, hỗ trợ bạn nhiệt tình.',
    ],
    D: [
      'Giao tiếp lịch sự, hợp tác tốt với bạn.',
      'Biết lắng nghe và chia sẻ ý kiến.',
      'Tự tin phát biểu, làm việc nhóm tốt.',
      'Biết trình bày ý kiến rõ ràng.',
      'Hợp tác tích cực, biết hỗ trợ bạn.',
    ],
    C: [
      'Cần giao tiếp lịch sự hơn với bạn bè.',
      'Cần lắng nghe và chia sẻ ý kiến hơn.',
      'Cần tự tin phát biểu trước lớp hơn.',
      'Cần trình bày ý kiến rõ ràng hơn.',
      'Cần tích cực hợp tác với bạn hơn.',
    ],
  },

  gqvd: {
    T: [
      'Tư duy sáng tạo, giải quyết vấn đề tốt.',
      'Có nhiều ý tưởng hay, sáng tạo xuất sắc.',
      'Quan sát tinh tế, đặt câu hỏi hay.',
      'Rất linh hoạt khi xử lý tình huống.',
      'Biết tìm nhiều cách giải quyết bài tập.',
    ],
    D: [
      'Biết tìm cách giải quyết vấn đề.',
      'Có tư duy sáng tạo, thích khám phá.',
      'Biết quan sát và đặt câu hỏi.',
      'Linh hoạt khi xử lý tình huống.',
      'Biết vận dụng kiến thức vào bài tập.',
    ],
    C: [
      'Cần suy nghĩ sáng tạo hơn khi học.',
      'Cần tích cực tìm cách giải quyết bài.',
      'Cần quan sát và đặt câu hỏi nhiều hơn.',
      'Cần linh hoạt hơn khi xử lý tình huống.',
      'Cần vận dụng kiến thức vào thực tế hơn.',
    ],
  },

  ngon_ngu: {
    T: [
      'Đọc rất trôi chảy, diễn đạt xuất sắc.',
      'Vốn từ phong phú, diễn đạt lưu loát.',
      'Viết đúng chính tả, trình bày rất đẹp.',
      'Đọc diễn cảm tốt, hiểu bài rất nhanh.',
      'Nói năng lịch sự, dùng từ chính xác.',
    ],
    D: [
      'Đọc trôi chảy, diễn đạt rõ ràng.',
      'Dùng từ ngữ phù hợp, nói năng lễ phép.',
      'Viết đúng chính tả, diễn đạt rõ ràng.',
      'Đọc hiểu tốt, biết kể lại nội dung bài.',
      'Nói lịch sự, dùng từ phù hợp.',
    ],
    C: [
      'Cần đọc trôi chảy và diễn đạt rõ hơn.',
      'Cần dùng từ ngữ phù hợp hơn.',
      'Cần viết đúng chính tả hơn.',
      'Cần đọc hiểu và kể lại bài tốt hơn.',
      'Cần mở rộng vốn từ nhiều hơn.',
    ],
  },

  tinh_toan: {
    T: [
      'Tính toán rất chính xác, trình bày đẹp.',
      'Nắm vững phép tính, làm bài rất nhanh.',
      'Tư duy logic tốt, giải toán xuất sắc.',
      'Tính nhẩm rất nhanh, không sai sót.',
      'Giải toán xuất sắc, trình bày khoa học.',
    ],
    D: [
      'Tính toán chính xác, trình bày sạch đẹp.',
      'Nắm vững các phép tính, làm bài đúng.',
      'Tư duy logic tốt, giải toán rõ ràng.',
      'Tính nhẩm nhanh, ít sai sót.',
      'Giải toán có phương pháp, trình bày tốt.',
    ],
    C: [
      'Cần tính toán cẩn thận hơn.',
      'Cần nắm vững các phép tính cơ bản.',
      'Cần rèn tư duy logic, giải toán hơn.',
      'Cần kiểm tra lại kết quả sau khi làm.',
      'Cần trình bày bài toán rõ ràng hơn.',
    ],
  },

  khoa_hoc: {
    T: [
      'Rất tò mò, ham tìm hiểu tự nhiên.',
      'Quan sát tinh tế, nhận xét hiện tượng tốt.',
      'Hiểu biết tốt về tự nhiên và xã hội.',
      'Biết liên hệ kiến thức vào thực tế tốt.',
      'Ham học hỏi, thích khám phá xung quanh.',
    ],
    D: [
      'Tò mò, ham tìm hiểu hiện tượng tự nhiên.',
      'Biết quan sát và nhận xét hiện tượng.',
      'Có hiểu biết tốt về tự nhiên xã hội.',
      'Biết liên hệ kiến thức vào thực tế.',
      'Ham học hỏi, thích khám phá thế giới.',
    ],
    C: [
      'Cần tò mò, tìm hiểu tự nhiên hơn.',
      'Cần quan sát và nhận xét hiện tượng hơn.',
      'Cần mở rộng hiểu biết về tự nhiên hơn.',
      'Cần liên hệ kiến thức vào thực tế hơn.',
      'Cần tích cực khám phá xung quanh hơn.',
    ],
  },

  tham_mi: {
    T: [
      'Khiếu thẩm mĩ xuất sắc, trình bày đẹp.',
      'Cảm nhận cái đẹp rất tinh tế.',
      'Vẽ sáng tạo, tô màu hài hòa xuất sắc.',
      'Yêu nghệ thuật, có năng khiếu nổi bật.',
      'Sáng tạo xuất sắc, ý tưởng độc đáo.',
    ],
    D: [
      'Có khiếu thẩm mĩ, trình bày bài đẹp.',
      'Biết cảm nhận cái đẹp xung quanh.',
      'Sáng tạo trong vẽ, tô màu hài hòa.',
      'Yêu thích nghệ thuật, có năng khiếu.',
      'Trình bày sạch đẹp, bố cục cân đối.',
    ],
    C: [
      'Cần rèn khiếu thẩm mĩ hơn.',
      'Cần cảm nhận cái đẹp và sáng tạo hơn.',
      'Cần tô màu hài hòa và vẽ đẹp hơn.',
      'Cần trình bày bài vở sạch đẹp hơn.',
      'Cần yêu thích và tham gia nghệ thuật hơn.',
    ],
  },

  the_chat: {
    T: [
      'Thể lực tốt, tham gia thể dục xuất sắc.',
      'Nhanh nhẹn, khéo léo trong vận động.',
      'Thực hiện thể dục đúng kỹ thuật, đẹp.',
      'Sức khỏe tốt, yêu thích thể thao.',
      'Thể lực phát triển tốt, dẻo dai bền bỉ.',
    ],
    D: [
      'Thể lực tốt, tích cực tham gia thể dục.',
      'Nhanh nhẹn, khéo léo trong hoạt động.',
      'Tham gia thể dục đầy đủ, đúng động tác.',
      'Có sức khỏe tốt, yêu thích vận động.',
      'Phối hợp vận động tốt, nhiệt tình.',
    ],
    C: [
      'Cần tích cực tham gia thể dục hơn.',
      'Cần rèn luyện thể lực mỗi ngày hơn.',
      'Cần thực hiện đúng động tác thể dục.',
      'Cần yêu thích và tham gia thể thao hơn.',
      'Cần có ý thức rèn luyện sức khỏe hơn.',
    ],
  },

  nl_dac_thu: {
    T: [
      'Có năng khiếu nổi bật, phát huy xuất sắc.',
      'Thể hiện năng lực đặc thù rất tốt.',
      'Có tố chất riêng, phát huy hiệu quả.',
      'Năng lực đặc thù phát triển xuất sắc.',
      'Phát huy tốt thế mạnh của bản thân.',
    ],
    D: [
      'Có năng khiếu, biết phát huy thế mạnh.',
      'Thể hiện tốt năng lực đặc thù.',
      'Có tố chất riêng, biết phát huy.',
      'Biết vận dụng năng lực riêng vào học.',
      'Thể hiện năng lực cá nhân rõ nét.',
    ],
    C: [
      'Cần phát huy hơn thế mạnh của mình.',
      'Cần rèn luyện và phát triển năng lực.',
      'Cần tích cực thể hiện năng lực hơn.',
      'Cần cố gắng phát huy tố chất riêng.',
      'Cần vận dụng năng lực riêng vào học.',
    ],
  },

  yeu_nuoc: {
    T: [
      'Yêu quê hương, tự hào dân tộc sâu sắc.',
      'Giữ gìn của công tốt, yêu thiên nhiên.',
      'Kính trọng anh hùng, yêu Tổ quốc.',
      'Tự hào truyền thống, biết ơn thầy cô.',
      'Tích cực bảo vệ môi trường xanh sạch.',
    ],
    D: [
      'Yêu quê hương, tự hào truyền thống.',
      'Biết giữ gìn của công và môi trường.',
      'Kính trọng các anh hùng dân tộc.',
      'Yêu trường lớp, giữ gìn của công.',
      'Có ý thức giữ vệ sinh nơi công cộng.',
    ],
    C: [
      'Cần yêu quê hương và tự hào dân tộc hơn.',
      'Cần giữ gìn của công và môi trường hơn.',
      'Cần kính trọng anh hùng dân tộc hơn.',
      'Cần có ý thức bảo vệ tài sản chung.',
      'Cần giữ vệ sinh trường lớp tốt hơn.',
    ],
  },

  nhan_ai: {
    T: [
      'Yêu thương bạn bè, giúp đỡ tận tình.',
      'Quan tâm, chia sẻ với mọi người rất tốt.',
      'Tốt bụng, luôn sẵn sàng giúp bạn.',
      'Có lòng nhân ái, biết nhường nhịn bạn.',
      'Sống chan hòa, thân thiện với mọi người.',
    ],
    D: [
      'Yêu thương bạn bè, biết giúp đỡ bạn.',
      'Quan tâm, chia sẻ với bạn bè.',
      'Tốt bụng, sẵn sàng giúp bạn khó khăn.',
      'Có lòng nhân ái, biết nhường nhịn.',
      'Sống chan hòa, thân thiện với bạn bè.',
    ],
    C: [
      'Cần yêu thương và giúp đỡ bạn hơn.',
      'Cần quan tâm, chia sẻ với bạn bè hơn.',
      'Cần sẵn sàng giúp bạn khi khó khăn.',
      'Cần biết nhường nhịn bạn bè hơn.',
      'Cần sống chan hòa, thân thiện hơn.',
    ],
  },

  cham_chi: {
    T: [
      'Chăm chỉ học bài, hoàn thành xuất sắc.',
      'Cần cù, kiên trì, không nản khi khó.',
      'Chuyên cần, đi học đúng giờ, gương mẫu.',
      'Siêng năng luyện tập, tiến bộ rõ rệt.',
      'Kiên trì luyện viết, chữ viết rất đẹp.',
    ],
    D: [
      'Chăm chỉ học bài, hoàn thành tốt bài.',
      'Cần cù, kiên trì khi gặp bài khó.',
      'Chuyên cần, ít nghỉ học, đúng giờ.',
      'Siêng năng luyện tập, có tiến bộ.',
      'Chăm chỉ ôn bài, kết quả tiến bộ.',
    ],
    C: [
      'Cần chăm chỉ học bài hơn.',
      'Cần cần cù, kiên trì hơn khi khó.',
      'Cần chuyên cần, đi học đúng giờ hơn.',
      'Cần siêng năng luyện tập để tiến bộ.',
      'Cần cố gắng hoàn thành bài đúng hạn.',
    ],
  },

  trung_thuc: {
    T: [
      'Thật thà, trung thực trong mọi việc.',
      'Dũng cảm nhận lỗi khi mắc sai lầm.',
      'Thẳng thắn, nói thật, đáng tin cậy.',
      'Trung thực trong kiểm tra, gương mẫu.',
      'Thành thật với thầy cô và cha mẹ.',
    ],
    D: [
      'Thật thà, trung thực trong học tập.',
      'Không gian lận, biết nhận lỗi khi sai.',
      'Thẳng thắn, nói thật với thầy cô.',
      'Trung thực trong kiểm tra, không cóp.',
      'Nói đúng sự thật, không bịa đặt.',
    ],
    C: [
      'Cần thật thà và trung thực hơn.',
      'Cần dũng cảm nhận lỗi khi sai lầm.',
      'Cần nói thật, không nói dối thầy cô.',
      'Cần trung thực trong kiểm tra hơn.',
      'Cần rèn tính thật thà, đáng tin cậy.',
    ],
  },

  trach_nhiem: {
    T: [
      'Có trách nhiệm cao với bản thân và lớp.',
      'Hoàn thành xuất sắc nhiệm vụ đúng hạn.',
      'Giữ lời hứa rất tốt, đáng tin cậy.',
      'Tự chịu trách nhiệm về hành động mình.',
      'Làm việc đến nơi đến chốn, gương mẫu.',
    ],
    D: [
      'Có trách nhiệm với bản thân và tập thể.',
      'Hoàn thành nhiệm vụ được giao đúng hạn.',
      'Biết giữ lời hứa, có trách nhiệm.',
      'Tự chịu trách nhiệm về hành động.',
      'Làm việc đến nơi đến chốn.',
    ],
    C: [
      'Cần có trách nhiệm hơn với bản thân.',
      'Cần hoàn thành nhiệm vụ đúng hạn hơn.',
      'Cần giữ lời hứa và có trách nhiệm hơn.',
      'Cần tự chịu trách nhiệm về hành động.',
      'Cần làm việc đến nơi đến chốn hơn.',
    ],
  },

};
