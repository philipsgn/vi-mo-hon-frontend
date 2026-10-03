/**
 * GIÁO TRÌNH CHƯƠNG 2 - 7: BẢN ĐỒ TÀI CHÍNH TOÀN DIỆN
 * Tuân thủ nghiêm ngặt quy chuẩn cấu trúc 7 phần tại docs/LESSONS.md
 */

export const CHAPTER_2_LESSONS = [
  {
    id: '2.1',
    chapterId: 2,
    order: 1,
    title: 'Bẫy Mỏ Neo Giá: Đừng Để Con Số Ban Đầu Đánh Lừa',
    subtitle: 'Cách các nhà bán lẻ thao túng nhận thức giá trị của bạn',
    duration: '5 phút',
    story:
      'Bước vào quán cà phê, menu để ly size Nhỏ 45.000 đ, size Vừa 55.000 đ và size Lớn 59.000 đ. Bạn vốn chỉ định uống một ly nhỏ vừa đủ, nhưng nhìn thấy size Lớn chỉ hơn size Vừa 4.000 đ, bạn quyết định nâng ngay lên size Lớn 59.000 đ vì nghĩ mình đang "hời".',
    coreConcept:
      'Hiệu ứng Mỏ neo (Anchoring Effect) khiến não bộ lấy con số đầu tiên nhìn thấy làm tiêu chuẩn so sánh. Mức giá 55.000 đ được đặt ra chỉ để làm "chim mồi", khiến mức giá 59.000 đ trông có vẻ rẻ, dù thực chất bạn vừa chi thêm tiền cho lượng nước bạn không cần.',
    exampleVnd:
      'Uống size Lớn 59.000 đ thay vì size Nhỏ 45.000 đ mỗi ngày làm bạn tốn thêm 14.000 đ/ngày x 30 = 420.000 đ/tháng (5.040.000 đ/năm) cho phần nước ngọt dư thừa.',
    mistakes: [
      'Chọn mua size lớn chỉ vì cảm giác "thêm có vài ngàn mà được gấp đôi".',
      'Đánh giá món đồ rẻ hay đắt dựa trên giá niêm yết ban đầu bị gạch ngang.',
      'Mua combo nhiều món không dùng chỉ để được giảm giá tổng.',
    ],
    appAction:
      'Trước khi chọn mua size lớn hay combo, hãy tự hỏi "Nhu cầu thực tế của mình là gì?". Vào Sổ ví ghi đúng số tiền thực chi để thấy tác động ngân sách ngày.',
    keyTakeaways: [
      'Giá trị thực của món đồ nằm ở nhu cầu sử dụng, không nằm ở mức giảm giá so với mỏ neo.',
      'Các mức giá "chim mồi" được thiết kế để điều hướng bạn chi tiêu nhiều hơn dự định.',
      'Luôn chọn đúng kích cỡ phù hợp với nhu cầu cơ thể và túi tiền của bạn.',
    ],
    references: 'Amos Tversky & Daniel Kahneman - Judgment under Uncertainty: Heuristics and Biases (1974).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_2_1',
      question: 'Hiệu ứng Mỏ neo giá (Anchoring Effect) hoạt động như thế nào trong tiếp thị?',
      options: [
        'Dùng mức giá ban đầu hoặc mức giá chim mồi để làm người mua cảm thấy mức giá kế tiếp là rẻ',
        'Tự động hạ giá tất cả mặt hàng xuống 0 đồng',
        'Bắt buộc người mua phải thanh toán bằng tiền mặt',
        'Cung cấp sản phẩm chất lượng cao nhất với giá thấp nhất thị trường',
      ],
      correctIndex: 0,
      explanation: 'Mỏ neo giá đánh lừa não bộ bằng cách đưa ra một con số so sánh ban đầu khiến các lựa chọn đắt hơn trông có vẻ hợp lý.',
    },
  },
  {
    id: '2.2',
    chapterId: 2,
    order: 2,
    title: 'Hiệu Ứng Diderot: Vòng Xoáy Mua Sắm Dây Chuyền',
    subtitle: 'Khi một món đồ mới kéo theo hàng loạt khoản chi không tên',
    duration: '6 phút',
    story:
      'Tuấn vừa tự thưởng cho mình chiếc bàn phím cơ 1.800.000 đ. Sau khi đặt lên bàn làm việc, Tuấn thấy con chuột cũ không hợp tông nên mua chuột mới 1.200.000 đ. Kế đó, chiếc bàn gỗ cũ trông cọc cạch, Tuấn lại chi tiếp 2.500.000 đ để đổi bàn công thái học và tấm lót chuột custom.',
    coreConcept:
      'Hiệu ứng Diderot mô tả hiện tượng tâm lý khi sở hữu một món đồ mới cao cấp hơn sẽ khiến toàn bộ các đồ vật cũ xung quanh trở nên "lỗi thời", kích hoạt chuỗi hành vi mua sắm bổ sung liên tục để tạo sự đồng bộ giả tạo.',
    exampleVnd:
      'Dự tính ban đầu chỉ mua bàn phím 1.800.000 đ, nhưng vòng xoáy Diderot đã cuốn bay 5.500.000 đ trong 2 tuần, tương đương 55% ngân sách sinh hoạt cả tháng của Tuấn.',
    mistakes: [
      'Không lường trước chi phí phụ kiện kèm theo khi mua một thiết bị mới.',
      'Đồng nhất sự hoàn hảo của không gian sống với việc phải mua đồ mới toàn bộ.',
      'Mua đồ vượt quá chuẩn sống hiện tại rồi phải gồng mình nâng cấp mọi thứ theo.',
    ],
    appAction:
      'Khi chuẩn bị mua một món đồ công nghệ hay thời trang lớn, hãy lập danh sách "Chi phí hệ sinh thái đi kèm". Nếu tổng vượt quá hạn mức tuần, hãy dừng lại.',
    keyTakeaways: [
      'Một món đồ mới đắt tiền luôn là mồi lửa châm ngòi cho chuỗi mua sắm dây chuyền.',
      'Hãy thỏa mãn với sự tiện dụng thực tế thay vì chạy theo sự đồng bộ hình thức.',
      'Kiểm soát điểm dừng trước khi vòng xoáy Diderot làm cạn kiệt số dư của bạn.',
    ],
    references: 'Denis Diderot - Regrets on Parting with My Old Dressing Gown (1769); James Clear - Atomic Habits (2018).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_2_2',
      question: 'Hiệu ứng Diderot gây nguy hiểm cho ví tiền của bạn như thế nào?',
      options: [
        'Kích hoạt chuỗi mua sắm dây chuyền không hồi kết để đồng bộ với món đồ mới',
        'Làm mất giá trị của tiền tiết kiệm ngân hàng',
        'Tăng lãi suất thẻ tín dụng lên gấp đôi',
        'Khiến ngân hàng đóng băng tài khoản giao dịch',
      ],
      correctIndex: 0,
      explanation: 'Hiệu ứng Diderot khiến người mua liên tục chi tiền mua thêm đồ phụ trợ nhằm khớp với món đồ mới sở hữu.',
    },
  },
  {
    id: '2.3',
    chapterId: 2,
    order: 3,
    title: 'FOMO và Nỗi Sợ Bị Bỏ Lại Trong Nhóm Bạn',
    subtitle: 'Chi tiêu để hòa nhập hay để làm hài lòng ánh nhìn người khác?',
    duration: '6 phút',
    story:
      'Cả nhóm bạn đại học rủ nhau đi du lịch nghỉ dưỡng 3 ngày 2 đêm với chi phí 3.500.000 đ/người. Tài khoản chỉ còn 2 triệu cho cả tháng, nhưng sợ bị gắn mác "xa lánh bạn bè" hay "ki bo", Hạnh bấm bụng mượn app vay tiêu dùng 2 triệu để đi cùng.',
    coreConcept:
      'FOMO (Fear of Missing Out) và áp lực đồng lứa (Peer Pressure) kích hoạt nỗi sợ bị cô lập xã hội. Bạn chi tiêu không phải vì bản thân muốn trải nghiệm, mà vì sợ cảm giác đứng ngoài các cuộc vui và câu chuyện của bạn bè.',
    exampleVnd:
      'Khoản vay 2.000.000 đ qua app với lãi suất 25%/năm cộng phí phạt khiến Hạnh phải trả tổng cộng 2.600.000 đ trong 3 tháng tiếp theo, tương đương nhịn ăn sáng 65 ngày.',
    mistakes: [
      'Dùng tiền vay mượn để chi trả cho các buổi tiệc tùng giải trí vượt quá khả năng.',
      'Nghĩ rằng từ chối một cuộc vui là đánh mất tình bạn.',
      'Đăng ảnh check-in sang chảnh lên mạng xã hội nhưng ăn mì tôm trong phòng trọ.',
    ],
    appAction:
      'Học cách từ chối khéo léo và trung thực: "Tháng này mình đang dồn tiền cho mục tiêu X, hẹn dịp sau nhé". Đặt hạn mức vui chơi cố định trong mục "Mục tiêu 4 trường".',
    keyTakeaways: [
      'Tình bạn chân chính không được đo bằng số tiền bạn chi trong các bữa tiệc.',
      'Sự tự tin tài chính bắt đầu từ dũng khí nói "Không" với những cuộc vui vượt ngân sách.',
      'Đừng đánh đổi tương lai tài chính của bạn để đổi lấy vài bức ảnh sống ảo.',
    ],
    references: 'Patrick J. McGinnis - The 10% Entrepreneur & FOMO (2014); Nghiên cứu sức khỏe tâm thần người trẻ châu Á (OECD 2023).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_2_3',
      question: 'Giải pháp đúng đắn nhất khi được bạn bè rủ đi chơi vượt quá ngân sách là gì?',
      options: [
        'Từ chối trung thực, hẹn dịp khác phù hợp hơn hoặc đề xuất hoạt động tiết kiệm hơn',
        'Vay tiền nóng lãi suất cao để đi cùng cho bằng bạn bằng bè',
        'Cắt tiền ăn uống thiết yếu cả tháng để dồn đi chơi 1 hôm',
        'Im lặng bỏ trốn và cắt đứt liên lạc với bạn bè',
      ],
      correctIndex: 0,
      explanation: 'Sự trung thực về tình trạng tài chính giúp bạn bảo vệ ví tiền và duy trì mối quan hệ bạn bè lành mạnh, bền vững.',
    },
  },
  {
    id: '2.4',
    chapterId: 2,
    order: 4,
    title: 'Khoảng Đệm 72 Giờ Cho Các Khoản Chi Lớn',
    subtitle: 'Nâng cấp quy tắc trì hoãn khi giá trị món đồ trên 1 triệu đồng',
    duration: '5 phút',
    story:
      'Thấy chiếc máy bay flycam mini 2.200.000 đ đang được review rầm rộ trên mạng, Nam suýt chốt đơn ngay. Nhớ quy tắc khoảng đệm, Nam ghi chú lại và hẹn 3 ngày sau xem xét. Đến ngày thứ 3, Nam nhận ra khu trọ mình cấm bay và tuần sau phải đóng tiền học tiếng Anh.',
    coreConcept:
      'Với các khoản chi lớn (trên 1–2 triệu đồng), thời gian hưng phấn của não bộ có thể kéo dài hơn 24 giờ. Khoảng đệm 72 giờ (3 ngày) giúp lý trí hoàn toàn làm chủ, đánh giá tính khả dụng và chi phí cơ hội của số tiền.',
    exampleVnd:
      '2.200.000 đ tương đương với 22 ngày ngân sách sinh hoạt (100k/ngày). Hoãn 72 giờ đã cứu Nam khỏi việc chôn vốn vào một món đồ chỉ dùng được 1 lần rồi bỏ xó.',
    mistakes: [
      'Nghĩ rằng mình "chắc chắn sẽ dùng mỗi ngày" trong cơn say mê ban đầu.',
      'Quyết định mua tài sản giá trị lớn chỉ sau vài video review ngắn trên TikTok.',
      'Xem nhẹ chi phí cơ hội: Mua món này đồng nghĩa với từ bỏ món khác quan trọng hơn.',
    ],
    appAction:
      'Vào Tab Coach, nhập món đồ giá trên 1 triệu và chọn "Xin Phán Quyết". Đặt lịch nhắc nhở sau 72 giờ trước khi đưa ra quyết định cuối cùng.',
    keyTakeaways: [
      'Giá trị món đồ càng lớn, thời gian trì hoãn cân nhắc cần càng dài.',
      'Sự hứng thú ban đầu thường giảm 70% sau 72 giờ không tiếp xúc với quảng cáo.',
      'Chi phí cơ hội luôn tồn tại: Mỗi đồng chi bốc đồng là một đồng mất đi ở mục tiêu lớn.',
    ],
    references: 'Morgan Housel - The Psychology of Money (2020); Robert Cialdini - Influence: The Psychology of Persuasion.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_2_4',
      question: 'Khoảng đệm 72 giờ đặc biệt phù hợp cho loại chi tiêu nào?',
      options: [
        'Các khoản chi mua sắm tài sản hoặc thiết bị giá trị lớn (trên 1–2 triệu đồng)',
        'Tiền mua đồ ăn sáng hàng ngày',
        'Tiền gửi xe và vé xe buýt',
        'Tiền đóng tiền điện nước đến hạn',
      ],
      correctIndex: 0,
      explanation: 'Khoảng đệm 72 giờ giúp lọc bỏ cảm xúc nhất thời đối với các giao dịch mua sắm chiếm tỷ trọng lớn trong ngân sách.',
    },
  },
  {
    id: '2.5',
    chapterId: 2,
    order: 5,
    title: 'Hội Chứng Tự Thưởng Vô Tội Vạ (Treat Yourself Trap)',
    subtitle: 'Biến phần thưởng thành thói quen bào mòn tài chính',
    duration: '5 phút',
    story:
      'Sau một ngày làm việc mệt mỏi, Mai tự nhủ: "Hôm nay mình vất vả rồi, phải tự thưởng bữa sushi 400.000 đ". Tuần đó Mai có 4 ngày "vất vả", và tổng tiền tự thưởng lên tới 1.600.000 đ — nhiều hơn cả tiền ăn cả tháng dự tính.',
    coreConcept:
      'Cơ chế Tự thưởng (Emotional Spending) lợi dụng sự kiệt sức của ý chí vào cuối ngày để hợp thức hóa các khoản chi xa xỉ. Bạn dùng việc mua sắm/ăn uống đắt đỏ như một liều thuốc giảm stress ngắn hạn.',
    exampleVnd:
      '1.600.000 đ tiền ăn tự thưởng trong 1 tuần tương đương 50% tiền thuê nhà. Stress giảm trong 30 phút ăn sushi, nhưng lo âu tài chính kéo dài suốt 3 tuần cuối tháng.',
    mistakes: [
      'Đánh đồng chăm sóc bản thân (Self-care) với việc phải tiêu thật nhiều tiền.',
      'Tự thưởng quá thường xuyên khiến nó trở thành mức sống mặc định mới.',
      'Mua sắm để giải tỏa cảm xúc buồn bực, cô đơn hoặc tức giận.',
    ],
    appAction:
      'Lập danh sách các hoạt động tự thưởng 0 đồng: Đi bộ công viên, đọc sách, nghe nhạc, ngủ đủ giấc. Thiết lập hạn mức "Quỹ tự thưởng" cố định trong app.',
    keyTakeaways: [
      'Chăm sóc bản thân đích thực là xây dựng sự an tâm tài chính, không phải tạo thêm nợ nần.',
      'Tách rời việc giải tỏa căng thẳng khỏi hành vi quẹt thẻ tiêu tiền.',
      'Giới hạn phần thưởng theo cột mốc thành tựu thực sự, không phải theo cảm xúc hàng ngày.',
    ],
    references: 'Kelly McGonigal - The Willpower Instinct (2012); Báo cáo Tâm lý tiêu dùng cảm xúc của APA (2022).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_2_5',
      question: 'Cách tự thưởng và chăm sóc bản thân lành mạnh nhất là gì?',
      options: [
        'Chọn các hoạt động thư giãn 0 đồng và chỉ tự thưởng trong hạn mức ngân sách đã định',
        'Quẹt thẻ mua đồ xa xỉ không giới hạn mỗi khi thấy mệt mỏi',
        'Vay tiền đi du lịch sang chảnh để giải tỏa áp lực công việc',
        'Bỏ theo dõi ngân sách để không bị căng thẳng',
      ],
      correctIndex: 0,
      explanation: 'Tự thưởng có kế hoạch giúp bạn cân bằng cảm xúc mà không gây tổn hại đến sự an toàn tài chính lâu dài.',
    },
  },
];

export const CHAPTER_3_LESSONS = [
  {
    id: '3.1',
    chapterId: 3,
    order: 1,
    title: 'Quỹ Dự Phòng Khẩn Cấp: Chiếc Áo Phao Sinh Tồn',
    subtitle: 'Khoản tiền giúp bạn không bao giờ phải vay nóng khi gặp biến cố',
    duration: '6 phút',
    story:
      'Đang đi làm, xe máy của Phong bị hỏng hộp số, tiền sửa hết 1.500.000 đ. Vì không có quỹ dự phòng, Phong đành phải bấm bụng vay bạn bè và hứa trả sau khi có lương, khiến cả tháng sau đó sống trong cảnh nơm nớp lo sợ.',
    coreConcept:
      'Quỹ khẩn cấp (Emergency Fund) là khoản tiền mặt thanh khoản cao, tương đương 1–3 tháng chi phí sinh hoạt tối thiểu, CHỈ ĐƯỢC DÙNG khi xảy ra biến cố bất khả kháng (hỏng xe, ốm đau, mất việc đột ngột).',
    exampleVnd:
      'Chi phí sinh hoạt tối thiểu: 4.000.000 đ/tháng. Quỹ khẩn cấp ban đầu cần tích lũy: 4.000.000 đ – 12.000.000 đ. Trích 500.000 đ/tháng, bạn sẽ hoàn thành tấm khiên bảo vệ trong 8–12 tháng.',
    mistakes: [
      'Rút quỹ dự phòng ra để săn sale hoặc mua sắm giải trí.',
      'Nghĩ rằng "mình còn trẻ, không bao giờ gặp chuyện bất trắc".',
      'Để toàn bộ tiền vào các kênh khó thanh khoản hoặc có rủi ro biến động giá.',
    ],
    appAction:
      'Vào Tab Hồ sơ, đặt mục tiêu "Quỹ khẩn cấp" với số tiền bằng 1 tháng sinh hoạt (ví dụ: 4.000.000 đ). Bật tính năng tích lũy kỷ luật mỗi ngày.',
    keyTakeaways: [
      'Quỹ khẩn cấp mang lại sự tự do tâm lý và giấc ngủ ngon trước mọi biến cố cuộc sống.',
      'Nguyên tắc vàng: Chỉ sử dụng cho sự việc Bất ngờ, Cần thiết và Khẩn cấp.',
      'Tích lũy từng khoản nhỏ đều đặn quan trọng hơn cố gắng gom một cục tiền lớn.',
    ],
    references: 'Dave Ramsey - The Total Money Makeover (2003); Sổ tay tài chính khẩn cấp của Cục Bảo vệ Tài chính Người tiêu dùng (CFPB).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_3_1',
      question: 'Trường hợp nào sau đây được phép sử dụng Quỹ dự phòng khẩn cấp?',
      options: [
        'Xe máy bị hỏng hóc đột ngột cần sửa ngay để đi làm hoặc phải đi khám bệnh bất ngờ',
        'Điện thoại mới ra mắt đang giảm giá 20%',
        'Bạn bè rủ đi ăn cưới tại nhà hàng sang trọng',
        'Mua vé concert âm nhạc của ca sĩ yêu thích',
      ],
      correctIndex: 0,
      explanation: 'Quỹ khẩn cấp chỉ phục vụ các nhu cầu sinh tồn khẩn cấp và biến cố bất ngờ, không dùng cho chi tiêu mong muốn cá nhân.',
    },
  },
  {
    id: '3.2',
    chapterId: 3,
    order: 2,
    title: 'Mục Tiêu 4 Trường (Z, Y, X, Lý Do) & Nghệ Thuật Giữ Tiền',
    subtitle: 'Biến ước mơ mơ hồ thành bản kế hoạch hành động cụ thể',
    duration: '6 phút',
    story:
      'Linh luôn nói: "Mình muốn tiết kiệm tiền". Nhưng sau 1 năm tài khoản vẫn bằng 0. Khi chuyển sang: "Tôi muốn giữ 5.000.000 đ (Z) từ 10.000.000 đ (Y) trước 31/12 (X) để mua khóa học UI/UX (Lý do)", Linh đạt mục tiêu chỉ sau 4 tháng.',
    coreConcept:
      'Phương pháp 4 trường chuyển hóa ý định cảm tính thành cam kết lý trí có định lượng: Số tiền cần giữ (Z), Số dư ban đầu (Y), Hạn chót (X), Lý do cốt lõi tạo động lực. Khi có đích đến rõ ràng, não bộ tự động điều chỉnh hành vi chi tiêu hàng ngày.',
    exampleVnd:
      'Mục tiêu giữ 6.000.000 đ trong 60 ngày. Ngân sách cho phép tiêu mỗi ngày = (Số dư hiện có - 6.000.000) / 60 ngày. Mỗi lần từ chối ly trà sữa 45k là bạn rút ngắn 1 bước đến đích.',
    mistakes: [
      'Đặt mục tiêu không có hạn chót cụ thể ("khi nào có thì hay").',
      'Không có lý do đủ mạnh khiến bạn dễ dàng từ bỏ khi gặp cám dỗ.',
      'Đặt mục tiêu quá phi thực tế so với thu nhập khiến bản thân nản lòng.',
    ],
    appAction:
      'Mở màn hình Hồ Sơ / Onboarding, rà soát lại 4 trường mục tiêu của bạn. Đảm bảo Lý Do là điều bạn thực sự khao khát đạt được.',
    keyTakeaways: [
      'Mục tiêu tài chính không có con số và ngày hạn chót chỉ là một điều ước.',
      'Lý do cảm xúc mạnh mẽ là chiếc mỏ neo giữ bạn không sa ngã trước cám dỗ.',
      'Chia nhỏ mục tiêu lớn thành nhịp độ ngân sách 24h từng ngày.',
    ],
    references: 'Edwin Locke & Gary Latham - Building a Practically Useful Theory of Goal Setting and Task Motivation (2002).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_3_2',
      question: 'Bốn trường thông tin cốt lõi trong mô hình thiết lập mục tiêu của Ví Mỏ Hỗn gồm những gì?',
      options: [
        'Số tiền cần giữ (Z), Thu nhập/Số dư (Y), Hạn chót (X), và Lý do tạo động lực',
        'Tên ngân hàng, Số tài khoản, Mã PIN, và Mã OTP',
        'Số lượt thích, Số bạn bè, Tên trường học, và Nghề nghiệp',
        'Mã chứng khoán, Giá mua, Giá bán, và Tỷ lệ đòn bẩy',
      ],
      correctIndex: 0,
      explanation: 'Mục tiêu 4 trường định hình rõ mục tiêu số lượng, mốc thời gian và động lực thúc đẩy người học giữ vững kỷ luật.',
    },
  },
  {
    id: '3.3',
    chapterId: 3,
    order: 3,
    title: 'Kỳ Quan Lãi Kép: Sức Mạnh Của Thời Gian & Kỷ Luật',
    subtitle: 'Cách những khoản tiền nhỏ tạo nên sự đột phá tài chính',
    duration: '7 phút',
    story:
      'An và Bình cùng 20 tuổi. An để dành 500.000 đ/tháng từ năm 20 đến 30 tuổi rồi ngưng (tổng vốn 60 triệu). Bình chờ đến năm 30 tuổi mới bắt đầu để dành 500.000 đ/tháng liên tục đến năm 50 tuổi (tổng vốn 120 triệu). Đến năm 50 tuổi, tài sản của An vẫn vượt xa Bình nhờ 10 năm lãi kép sớm.',
    coreConcept:
      'Lãi kép (Compound Interest) là quá trình tiền lãi sinh ra tiếp tục được cộng vào vốn gốc để tạo ra lãi mẹ đẻ lãi con. Yếu tố quan trọng nhất của lãi kép không phải là số tiền ban đầu, mà là THỜI GIAN bắt đầu.',
    exampleVnd:
      'Tích lũy 30.000 đ/ngày (bằng 1 ly cà phê vỉa hè) = 900.000 đ/tháng. Sau 10 năm với mức sinh lời 7%/năm, bạn tích lũy được hơn 155.000.000 đ (trong đó tiền lãi chiếm hơn 47 triệu).',
    mistakes: [
      'Nghĩ rằng "có vài trăm ngàn để dành làm gì, chừng nào giàu rồi tính".',
      'Bắt đầu quá muộn và đánh mất những năm tháng vàng son của lãi kép.',
      'Rút vốn non giữa chừng để mua sắm tiêu sản.',
    ],
    appAction:
      'Bắt đầu ngay hôm nay với mục tiêu nhỏ nhất: Cắt giảm 20.000 đ chi tiêu lãng phí mỗi ngày và ghi nhận vào Sổ ví.',
    keyTakeaways: [
      'Thời điểm tốt nhất để tích lũy là 10 năm trước. Thời điểm tốt thứ hai là NGAY BÂY GIỜ.',
      'Sự nhất quán và kiên trì đánh bại sự bốc đồng ngẫu hứng.',
      'Lãi kép chỉ phát huy sức mạnh tối đa khi bạn không ngắt quãng dòng tiền.',
    ],
    references: 'Albert Einstein (attributed quote on Compound Interest); Burton G. Malkiel - A Random Walk Down Wall Street.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_3_3',
      question: 'Yếu tố nào đóng vai trò quyết định lớn nhất đến sức mạnh của Lãi kép?',
      options: [
        'Thời gian bắt đầu tích lũy sớm và tính kỷ luật duy trì liên tục',
        'Số tiền gửi ban đầu phải từ 1 tỷ đồng trở lên',
        'Việc liên tục thay đổi ngân hàng mỗi tuần',
        'Mua sắm thật nhiều đồ hiệu để tích trữ',
      ],
      correctIndex: 0,
      explanation: 'Bắt đầu càng sớm, thời gian tích lũy càng dài thì hiệu ứng lãi mẹ đẻ lãi con càng phát huy sức mạnh bùng nổ.',
    },
  },
  {
    id: '3.4',
    chapterId: 3,
    order: 4,
    title: 'Tự Động Hóa Dòng Tiền: Trả Cho Bản Thân Trước',
    subtitle: 'Xây dựng hệ thống tài chính không phụ thuộc vào ý chí',
    duration: '5 phút',
    story:
      'Trước đây, Cường luôn đợi đến ngày 30 cuối tháng xem còn dư bao nhiêu thì mới tiết kiệm, và tháng nào tài khoản cũng về số 0. Khi chuyển sang cài lệnh chuyển tự động 1.000.000 đ sang tài khoản tiết kiệm ngay ngày 5 (ngày nhận lương), Cường tích lũy êm đẹp cả năm mà không thấy thiếu thốn.',
    coreConcept:
      'Quy tắc "Trả cho bản thân trước" (Pay Yourself First) đảo ngược công thức chi tiêu truyền thống: Thu nhập - Tiết kiệm = Số tiền được phép tiêu. Tự động hóa giúp bạn loại bỏ hoàn toàn sự giằng xé tâm lý và cám dỗ.',
    exampleVnd:
      'Lương 8.000.000 đ. Ngay ngày nhận lương, tự động trích 1.000.000 đ (12.5%). Phần còn lại 7.000.000 đ được chia đều cho 30 ngày = 233.000 đ/ngày để sinh hoạt thoải mái.',
    mistakes: [
      'Chờ đợi "tiêu còn thừa mới tiết kiệm" (thực tế không bao giờ thừa).',
      'Để toàn bộ tiền chi tiêu và tiền tiết kiệm chung một tài khoản thanh toán.',
      'Trích lập quá nhiều vượt khả năng sinh hoạt khiến phải rút ra lại ngay sau 1 tuần.',
    ],
    appAction:
      'Mở ứng dụng ngân hàng, thiết lập lệnh trích tiền tự động định kỳ vào ngày nhận lương sang tài khoản tích lũy không mở thẻ rút tiền.',
    keyTakeaways: [
      'Đừng trông cậy vào ý chí; hãy thiết lập hệ thống tự động bảo vệ tiền của bạn.',
      'Tiết kiệm trước, chi tiêu phần còn lại là bí mật số một của sự độc lập tài chính.',
      'Tách biệt tài khoản thanh toán hàng ngày khỏi tài khoản tích lũy dài hạn.',
    ],
    references: 'George S. Clason - The Richest Man in Babylon (1926); David Bach - The Automatic Millionaire (2004).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_3_4',
      question: 'Bản chất của quy tắc "Trả cho bản thân trước" (Pay Yourself First) là gì?',
      options: [
        'Trích ngay một phần thu nhập vào quỹ tích lũy ngay khi nhận lương, rồi mới chi tiêu phần còn lại',
        'Tự thưởng một bữa ăn thịnh soạn đắt đỏ ngay ngày nhận lương',
        'Rút toàn bộ tiền mặt để trong ví để chi tiêu cho thoải mái',
        'Vay thêm tiền để mua sắm món đồ mình thích nhất',
      ],
      correctIndex: 0,
      explanation: 'Trả cho bản thân trước đảm bảo mục tiêu tích lũy luôn được hoàn thành trước khi các cám dỗ tiêu dùng hàng ngày xuất hiện.',
    },
  },
];

export const CHAPTER_4_LESSONS = [
  {
    id: '4.1',
    chapterId: 4,
    order: 1,
    title: 'Bản Chất Thẻ Tín Dụng: Tiền Của Ngân Hàng, Không Phải Tiền Của Bạn',
    subtitle: 'Hiểu đúng về hạn mức tín dụng và chiếc bẫy chi tiêu trước trả sau',
    duration: '6 phút',
    story:
      'Được cấp thẻ tín dụng hạn mức 20.000.000 đ, Hoàng cảm thấy mình như có thêm một khoản tiền dư dả. Hoàng liên tục quẹt thẻ mua sắm, ăn uống. Đến ngày sao kê, số tiền phải thanh toán là 18.500.000 đ trong khi lương của Hoàng chỉ có 9.000.000 đ.',
    coreConcept:
      'Thẻ tín dụng là khoản vay ngắn hạn lãi suất cao (20%–40%/năm) nếu không thanh toán đủ 100% đúng hạn. Quẹt thẻ làm mất đi cảm giác "đau đớn khi mất tiền mặt" (Pain of Paying), khiến bạn tiêu nhiều hơn 20%–30% so với bình thường.',
    exampleVnd:
      'Nợ thẻ tín dụng 18.500.000 đ. Nếu chỉ trả số tiền tối thiểu (khoảng 900.000 đ/tháng), bạn sẽ mất hơn 4 năm để trả hết và gánh thêm hơn 11.000.000 đ tiền lãi phạt.',
    mistakes: [
      'Xem hạn mức thẻ tín dụng là tiền thu nhập cá nhân được phép tiêu.',
      'Chỉ thanh toán số tiền tối thiểu (Minimum Payment) mỗi kỳ sao kê.',
      'Rút tiền mặt từ thẻ tín dụng tại cây ATM (phí rút 4% + tính lãi ngay tức thì).',
    ],
    appAction:
      'Nếu dùng thẻ tín dụng, hãy coi nó như thẻ ghi nợ: Chỉ quẹt khi trong tài khoản ngân hàng ĐÃ CÓ SẴN số tiền mặt tương ứng để trả ngay.',
    keyTakeaways: [
      'Thẻ tín dụng là công cụ thanh toán tiện lợi, nhưng là cỗ máy tạo nợ nguy hiểm nếu thiếu kỷ luật.',
      'Luôn thanh toán 100% dư nợ sao kê đúng hạn để không bao giờ bị tính 1 đồng tiền lãi.',
      'Tuyệt đối không bao giờ rút tiền mặt từ thẻ tín dụng.',
    ],
    references: 'Prelec & Simester - Always Leave Home Without It: A Further Investigation of the Credit-Card Effect (MIT 2001).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_4_1',
      question: 'Hậu quả nguy hiểm nhất của việc chỉ trả số tiền tối thiểu (Minimum Payment) trên thẻ tín dụng là gì?',
      options: [
        'Phần dư nợ còn lại bị tính lãi suất rất cao (30–40%/năm) và tích tụ thành khoản nợ khổng lồ kéo dài nhiều năm',
        'Ngân hàng sẽ tự động tăng lương cho bạn',
        'Bạn được miễn phí thường niên trọn đời',
        'Điểm tín dụng của bạn tăng vọt lên mức tối đa',
      ],
      correctIndex: 0,
      explanation: 'Trả tối thiểu khiến tiền lãi lũy kế dồn dập, biến món nợ nhỏ ban đầu thành gánh nặng tài chính kéo dài nhiều năm.',
    },
  },
  {
    id: '4.2',
    chapterId: 4,
    order: 2,
    title: 'Ma Trận Trả Góp 0%: Phí Ẩn & Ảo Tưởng Giá Rẻ',
    subtitle: 'Giải mã chiêu trò chia nhỏ số tiền để kích thích mua sắm',
    duration: '6 phút',
    story:
      'Chiếc điện thoại giá 24.000.000 đ có chương trình "Trả góp 0% chỉ 2.000.000 đ/tháng". Nghĩ là rẻ, Vy chốt ngay. Tuy nhiên hợp đồng cộng thêm: Phí bảo hiểm khoản vay 1.200.000 đ, Phí chuyển đổi trả góp 800.000 đ, và Phí thu hộ 40.000 đ/tháng. Tổng chi phí thực tế lên tới 26.480.000 đ.',
    coreConcept:
      'Trả góp 0% thường đi kèm các loại phí ẩn (Phí chuyển đổi giao dịch, phí hồ sơ, phí bảo hiểm). Quan trọng hơn, việc chia nhỏ 24 triệu thành 2 triệu/tháng tạo ảo giác "mình đủ khả năng chi trả", khiến bạn mua món đồ vượt xa mức thu nhập thực tế.',
    exampleVnd:
      'Thu nhập 8.000.000 đ/tháng mà gánh khoản trả góp 2.200.000 đ/tháng tức là bạn đã thế chấp 27.5% tổng thu nhập hàng tháng trong suốt 1 năm tiếp theo.',
    mistakes: [
      'Không cộng tổng toàn bộ các loại phí ẩn vào giá bán cuối cùng.',
      'Mua nhiều món trả góp cùng lúc khiến tổng tiền phải trả hàng tháng vượt 40% thu nhập.',
      'Mua trả góp cho những món tiêu sản mất giá nhanh chóng sau khi mở hộp.',
    ],
    appAction:
      'Trước khi ký hợp đồng trả góp 0%, hãy yêu cầu nhân viên tính: "Tổng số tiền tôi phải bỏ ra từ đầu đến cuối là bao nhiêu?". Ghi khoản này vào Sổ ví.',
    keyTakeaways: [
      'Không có bữa trưa nào miễn phí; trả góp 0% luôn có chi phí ẩn hoặc chi phí cơ hội đi kèm.',
      'Nếu bạn không thể mua món đồ bằng 2 lần tiền mặt hiện có, bạn chưa đủ khả năng mua trả góp món đó.',
      'Bảo vệ dòng tiền hàng tháng là ưu tiên hàng đầu.',
    ],
    references: 'Nghiên cứu thị trường Tài chính Tiêu dùng Việt Nam (FiinGroup Report 2023).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_4_2',
      question: 'Khi tham gia chương trình "Trả góp 0%", người mua cần kiểm tra kỹ điều gì nhất?',
      options: [
        'Tổng số tiền thực tế phải trả bao gồm phí chuyển đổi, phí hồ sơ, bảo hiểm và phí thu hộ',
        'Màu sắc của chiếc bút ký hợp đồng',
        'Thời tiết ngày đi mua hàng',
        'Tên của nhân viên thu ngân',
      ],
      correctIndex: 0,
      explanation: 'Phí chuyển đổi và các chi phí ẩn có thể làm tăng giá trị thực tế của sản phẩm lên nhiều triệu đồng so với giá niêm yết ban đầu.',
    },
  },
  {
    id: '4.3',
    chapterId: 4,
    order: 3,
    title: 'Bẫy Vay Tiêu Dùng Nhanh & Vòng Xoáy Lãi Mẹ Đẻ Lãi Con',
    subtitle: 'Nhận diện các ứng dụng vay tiền trực tuyến với lãi suất cắt cổ',
    duration: '7 phút',
    story:
      'Cần 3 triệu đóng tiền trọ gấp, Quang tải app vay online "Duyệt trong 5 phút". App giải ngân 3 triệu nhưng thực nhận chỉ 2.1 triệu (trừ 900k phí dịch vụ) và bắt trả 3.3 triệu sau 7 ngày. Không có tiền trả, Quang vay app thứ 2 để đắp vào app thứ 1. Sau 2 tháng, tổng nợ phình to lên 35 triệu đồng.',
    coreConcept:
      'Các ứng dụng vay tiêu dùng không chính thống lách luật bằng cách tính lãi suất danh nghĩa thấp nhưng áp các loại "Phí thẩm định", "Phí dịch vụ" cực cao. Mức lãi suất thực tế có thể lên tới 300%–1000%/năm, biến người vay thành con nợ luẩn quẩn.',
    exampleVnd:
      'Vay 3.000.000 đ sau 2 tháng biến thành 35.000.000 đ. Toàn bộ tiền lương và danh dự cá nhân, gia đình bị đe dọa bởi các cuộc gọi đòi nợ khủng bố.',
    mistakes: [
      'Vay tiền app để giải quyết các vấn đề tài chính ngắn hạn mà không có nguồn trả chắc chắn.',
      'Vay app sau để trả nợ app trước (đòn bẩy âm vô cực).',
      'Cấp quyền truy cập danh bạ và hình ảnh trên điện thoại cho các app vay lạ.',
    ],
    appAction:
      'Xây dựng Quỹ khẩn cấp tối thiểu 1 tháng lương trong app Ví Mỏ Hỗn để không bao giờ phải tìm đến các ứng dụng vay nóng.',
    keyTakeaways: [
      'Tuyệt đối không bao giờ vay tiền qua các ứng dụng không rõ nguồn gốc pháp lý.',
      'Vay app sau trả app trước là con đường ngắn nhất dẫn đến phá sản cá nhân.',
      'Luôn tìm đến sự hỗ trợ của gia đình hoặc tổ chức tín dụng hợp pháp khi gặp khủng hoảng.',
    ],
    references: 'Cảnh báo của Ngân hàng Nhà nước Việt Nam về tín dụng đen công nghệ cao; Bộ luật Dân sự 2015 quy định về trần lãi suất.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_4_3',
      question: 'Hành động nào sau đây là nguy hiểm và tuyệt đối KHÔNG ĐƯỢC LÀM khi gặp khó khăn tài chính?',
      options: [
        'Vay tiền qua các app không rõ nguồn gốc và vay app này để trả nợ app khác',
        'Lập bảng chi tiêu cắt giảm toàn bộ các khoản mua sắm giải trí',
        'Thành thật chia sẻ với gia đình để tìm giải pháp lành mạnh',
        'Tìm việc làm thêm bán thời gian để gia tăng thu nhập thực tế',
      ],
      correctIndex: 0,
      explanation: 'Vay app không chính thống và vay đắp nợ sẽ kích hoạt vòng xoáy lãi mẹ đẻ lãi con hủy hoại hoàn toàn tương lai tài chính.',
    },
  },
  {
    id: '4.4',
    chapterId: 4,
    order: 4,
    title: 'Điểm Tín Dụng Cá Nhân (CIC): Tài Sản Vô Hình Quý Giá',
    subtitle: 'Cách một vết nhơ nợ xấu 50k có thể chặn đứng ước mơ mua nhà sau này',
    duration: '6 phút',
    story:
      'Đức tốt nghiệp, đi làm 5 năm và muốn vay ngân hàng mua căn hộ trả góp. Ngân hàng từ chối vì Đức có lịch sử nợ xấu nhóm 3 trên hệ thống CIC: Hóa ra hồi sinh viên, Đức mở thẻ tín dụng và quên trả khoản phí thường niên 150.000 đ trong suốt 1 năm.',
    coreConcept:
      'Trung tâm Thông tin Tín dụng Quốc gia (CIC) ghi nhận toàn bộ lịch sử vay nợ, trả chậm của bạn tại mọi ngân hàng và công ty tài chính. Nợ xấu (trễ hạn từ 10 ngày trở lên) sẽ lưu vết từ 3–5 năm, tước đi cơ hội vay mua nhà, mua xe hoặc xin visa du học.',
    exampleVnd:
      'Khoản nợ quên trả 150.000 đ làm mất cơ hội tiếp cận gói vay mua nhà lãi suất ưu đãi 500.000.000 đ của ngân hàng trong suốt 5 năm thanh xuân.',
    mistakes: [
      'Nghĩ rằng nợ số tiền nhỏ (vài chục ngàn) thì ngân hàng sẽ bỏ qua.',
      'Cho người khác mượn CCCD/thông tin cá nhân để đứng tên vay giùm.',
      'Bỏ qua các tin nhắn nhắc nợ hoặc đổi số điện thoại để trốn tránh.',
    ],
    appAction:
      'Đặt lịch nhắc nhở thanh toán hóa đơn cố định vào ngày 25 hàng tháng. Bật thông báo đẩy trong app để không bỏ lỡ ngày sao kê.',
    keyTakeaways: [
      'Điểm tín dụng là uy tín tài chính danh dự của bạn trước toàn bộ hệ thống ngân hàng.',
      'Một khoản trễ hạn dù nhỏ cũng để lại vết sẹo dữ liệu kéo dài nhiều năm.',
      'Bảo vệ thông tin CCCD và tài khoản ngân hàng như bảo vệ chìa khóa nhà của bạn.',
    ],
    references: 'Thông tư 03/2013/TT-NHNN quy định về hoạt động thông tin tín dụng của Ngân hàng Nhà nước Việt Nam.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_4_4',
      question: 'Hệ thống CIC tại Việt Nam có chức năng chính là gì?',
      options: [
        'Lưu trữ và xếp hạng lịch sử tín dụng, nợ nần và mức độ uy tín thanh toán của cá nhân',
        'Phát hành tiền mặt và tiền xu',
        'Tổ chức các sự kiện mua sắm giảm giá trực tuyến',
        'Bán bảo hiểm nhân thọ và xe máy',
      ],
      correctIndex: 0,
      explanation: 'CIC theo dõi toàn bộ lịch sử thanh toán nợ của cá nhân, quyết định việc bạn có đủ điều kiện vay vốn ngân hàng trong tương lai hay không.',
    },
  },
  {
    id: '4.5',
    chapterId: 4,
    order: 5,
    title: 'Chiến Lược Thoát Nợ: Quả Cầu Tuyết (Snowball) vs Tuyết Lở (Avalanche)',
    subtitle: 'Hai phương pháp khoa học giúp bạn xóa sạch nợ nần từng bước',
    duration: '6 phút',
    story:
      'Hà đang có 3 khoản nợ: Nợ bạn 1 triệu (0% lãi), nợ thẻ tín dụng 5 triệu (30%/năm), và nợ trả góp laptop 10 triệu (15%/năm). Áp dụng phương pháp Quả cầu tuyết, Hà dồn tiền trả dứt điểm khoản 1 triệu trước. Cảm giác xóa được 1 món nợ tạo động lực cực lớn để Hà tiếp tục tất toán 2 khoản còn lại.',
    coreConcept:
      'Phương pháp Quả cầu tuyết (Snowball) ưu tiên trả món nợ nhỏ nhất trước để tạo chiến thắng tâm lý. Phương pháp Tuyết lở (Avalanche) ưu tiên trả món nợ có lãi suất cao nhất trước để tối ưu toán học. Cả hai đều yêu cầu duy trì thanh toán tối thiểu cho các khoản còn lại.',
    exampleVnd:
      'Khoản nợ thẻ tín dụng 5 triệu lãi 30%/năm tiêu tốn 1.500.000 đ tiền lãi mỗi năm. Trả dứt điểm khoản này giúp bạn giải phóng 125.000 đ tiền lãi lãng phí mỗi tháng.',
    mistakes: [
      'Trả dàn trải mỗi khoản một ít không có chiến lược rõ ràng.',
      'Tiếp tục vay mượn thêm trong quá trình đang trả nợ cũ.',
      'Không ghi chép chi tiết danh sách các chủ nợ, số tiền và lãi suất cụ thể.',
    ],
    appAction:
      'Liệt kê toàn bộ danh sách nợ vào mục ghi chú, sắp xếp theo thứ tự số tiền từ nhỏ đến lớn. Cắt giảm ngân sách ngày để dồn tiền dập tắt khoản nợ số 1.',
    keyTakeaways: [
      'Chiến thắng tâm lý từ việc xóa sổ một món nợ nhỏ là đòn bẩy mạnh mẽ nhất để thoát nợ.',
      'Dừng ngay hành vi tạo thêm nợ mới khi đang trong giai đoạn phục hồi tài chính.',
      'Tập trung toàn lực vào một mục tiêu nợ duy nhất tại một thời điểm.',
    ],
    references: 'Dave Ramsey - The Snowball Method (2003); Journal of Consumer Research on Debt Repayment Behavior (2016).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_4_5',
      question: 'Phương pháp trả nợ "Quả cầu tuyết" (Debt Snowball) hoạt động theo nguyên lý nào?',
      options: [
        'Ưu tiên dồn toàn lực trả dứt điểm khoản nợ có số tiền nhỏ nhất trước để tạo động lực tâm lý',
        'Đợi mùa đông có tuyết rơi mới bắt đầu trả nợ',
        'Vay thêm một khoản tiền khổng lồ để trả hết tất cả nợ cũ',
        'Không trả tiền cho bất kỳ chủ nợ nào',
      ],
      correctIndex: 0,
      explanation: 'Phương pháp Quả cầu tuyết tập trung trả dứt điểm món nợ nhỏ nhất trước để tạo hưng phấn tâm lý chiến thắng, thúc đẩy quá trình thoát nợ.',
    },
  },
];

export const CHAPTER_5_LESSONS = [
  {
    id: '5.1',
    chapterId: 5,
    order: 1,
    title: 'Lạm Phát: Kẻ Trộm Vô Hình Bào Mòn Sức Mua',
    subtitle: 'Vì sao để tiền nằm yên dưới gối là bạn đang nghèo đi mỗi ngày',
    duration: '6 phút',
    story:
      'Năm 2014, một bát phở bò có giá 25.000 đ. Năm 2024, bát phở tương tự có giá 50.000 đ. Tờ 500.000 đ ngày xưa mua được 20 bát phở, nhưng hôm nay chỉ còn mua được 10 bát, dù con số 500.000 đ in trên tờ tiền không hề thay đổi.',
    coreConcept:
      'Lạm phát (Inflation) là sự tăng mức giá chung có tính chất kéo dài của hàng hóa và dịch vụ, làm suy giảm sức mua của đồng tiền. Tiền mặt không sinh lời sẽ bị lạm phát âm thầm "ăn mòn" giá trị thực tế theo từng năm tháng.',
    exampleVnd:
      'Để 10.000.000 đ trong két sắt 10 năm với mức lạm phát trung bình 4%/năm, sức mua thực tế của số tiền đó sau 10 năm chỉ còn tương đương khoảng 6.750.000 đ ở thời điểm ban đầu.',
    mistakes: [
      'Nghĩ rằng giữ tiền mặt tuyệt đối không bao giờ bị lỗ.',
      'Không tính yếu tố lạm phát khi lập kế hoạch mục tiêu tài chính dài hạn (5–10 năm).',
      'Đánh đồng số lượng tiền trong tài khoản với giá trị hàng hóa thực tế mua được.',
    ],
    appAction:
      'Xây dựng thói quen phân bổ tài sản: Giữ đủ tiền chi tiêu và quỹ khẩn cấp trong tài khoản thanh khoản cao, phần tiền nhàn rỗi dài hạn cần tìm kênh sinh lời bù đắp lạm phát.',
    keyTakeaways: [
      'Lạm phát là quy luật tất yếu của nền kinh tế đang phát triển.',
      'Để tiền nhàn rỗi không sinh lời đồng nghĩa với việc chấp nhận mất sức mua mỗi ngày.',
      'Mục tiêu tài chính thông minh phải luôn tính đến tỷ lệ lạm phát hàng năm.',
    ],
    references: 'Tổng cục Thống kê Việt Nam (GSO) - Báo cáo Chỉ số giá tiêu dùng CPI các thời kỳ; N. Gregory Mankiw - Principles of Economics.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_5_1',
      question: 'Bản chất của Lạm phát (Inflation) đối với túi tiền của bạn là gì?',
      options: [
        'Làm tăng mức giá chung của hàng hóa dịch vụ, khiến sức mua của đồng tiền bị suy giảm theo thời gian',
        'Làm tờ tiền trong ví tự động biến mất',
        'Tự động tăng gấp đôi số tiền trong tài khoản ngân hàng',
        'Làm cho tất cả mọi thứ trên thị trường trở nên hoàn toàn miễn phí',
      ],
      correctIndex: 0,
      explanation: 'Lạm phát làm giá cả hàng hóa leo thang, do đó cùng một số tiền bạn sẽ mua được ít hàng hóa hơn trong tương lai.',
    },
  },
  {
    id: '5.2',
    chapterId: 5,
    order: 2,
    title: 'Phân Biệt Tiết Kiệm & Đầu Tư: Hai Bánh Xe Của Cỗ Xe Tài Chính',
    subtitle: 'Biết khi nào cần phòng thủ an toàn, khi nào cần chủ động tăng trưởng',
    duration: '6 phút',
    story:
      'Khoa vừa đi làm tiết kiệm được 5 triệu đầu tiên, nghe bạn bè rủ rê đã đem toàn bộ số tiền mua một đồng coin rác với hy vọng x10 tài khoản. Sau 3 ngày đồng coin chia 10, Khoa mất trắng tiền ăn cả tháng và rơi vào khủng hoảng sinh hoạt.',
    coreConcept:
      'Tiết kiệm (Saving) là chiếc khiên phòng thủ: Bảo toàn vốn, rủi ro cực thấp, thanh khoản tức thì (tiền gửi ngân hàng, quỹ khẩn cấp). Đầu tư (Investing) là thanh kiếm tấn công: Chấp nhận biến động trong ngắn hạn để tìm kiếm mức sinh lời cao hơn lạm phát trong dài hạn.',
    exampleVnd:
      'Quy tắc sinh tồn: Chỉ bắt đầu đầu tư khi đã có Quỹ dự phòng khẩn cấp tối thiểu 3 tháng (ví dụ: 12.000.000 đ) và tuyệt đối không bao giờ đầu tư bằng tiền sinh hoạt của tháng tới.',
    mistakes: [
      'Đem toàn bộ tiền sinh hoạt hoặc tiền đi vay để đi đầu tư mạo hiểm.',
      'Nhầm lẫn giữa đầu tư bài bản dài hạn với cờ bạc đỏ đen ngắn hạn.',
      'Bắt đầu đầu tư khi chưa có kiến thức nền tảng và chưa có quỹ phòng thủ.',
    ],
    appAction:
      'Kiểm tra lại mục tiêu trong app: Đảm bảo bạn đã hoàn thành 100% thanh tiến độ Quỹ Khẩn Cấp trước khi tìm hiểu các kênh đầu tư.',
    keyTakeaways: [
      'Tiết kiệm là nền móng, đầu tư là mái nhà; không thể xây mái nhà khi móng chưa vững.',
      'Lợi nhuận kỳ vọng luôn đi kèm với mức độ rủi ro tương ứng.',
      'Không bao giờ mạo hiểm số tiền mà bạn không thể chấp nhận mất.',
    ],
    references: 'Benjamin Graham - The Intelligent Investor (1949); Howard Marks - The Most Important Thing.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_5_2',
      question: 'Điều kiện tiên quyết trước khi bắt đầu trích tiền đi đầu tư là gì?',
      options: [
        'Đã xây dựng vững chắc Quỹ dự phòng khẩn cấp và không dùng tiền sinh hoạt thiết yếu để đầu tư',
        'Vay tiền nóng lãi suất cao để có số vốn thật lớn',
        'Nghỉ việc hoàn toàn để theo dõi bảng điện tử 24/7',
        'Mua ngay tài sản theo lời khuyên của người lạ trên mạng xã hội',
      ],
      correctIndex: 0,
      explanation: 'Phải đảm bảo an toàn sinh tồn bằng Quỹ khẩn cấp trước khi chấp nhận rủi ro biến động giá trên thị trường đầu tư.',
    },
  },
  {
    id: '5.3',
    chapterId: 5,
    order: 3,
    title: 'Đa Dạng Hóa Danh Mục: Đừng Bỏ Trứng Vào Một Giỏ',
    subtitle: 'Nguyên tắc quản trị rủi ro cơ bản nhất trong thế giới tài chính',
    duration: '5 phút',
    story:
      'Thắng tin tưởng tuyệt đối vào một cổ phiếu duy nhất của một công ty bất động sản và dồn toàn bộ 50 triệu tích lũy vào đó. Khi công ty gặp sự cố pháp lý và cổ phiếu mất thanh khoản nhiều tháng, Thắng hoàn toàn bị phong tỏa tài chính và không thể xoay xở.',
    coreConcept:
      'Đa dạng hóa (Diversification) phân bổ nguồn vốn vào nhiều lớp tài sản khác nhau (tiền gửi, chứng chỉ quỹ chỉ số, vàng, trái phiếu) để giảm thiểu tác động tiêu cực khi một kênh cá biệt gặp rủi ro.',
    exampleVnd:
      'Phân bổ 20 triệu: 10 triệu gửi tiết kiệm an toàn (50%), 6 triệu vào chứng chỉ quỹ ETF đa dạng (30%), 4 triệu tích lũy vàng/dự phòng (20%). Khi 1 kênh biến động, 80% tài sản còn lại vẫn an toàn.',
    mistakes: [
      'Dồn 100% tiền vào một mã cổ phiếu, một dự án hay một người huy động vốn duy nhất.',
      'Nghĩ rằng đa dạng hóa là mua 5 mã cổ phiếu trong cùng một ngành nghề.',
      'Đầu tư vào những thứ bản thân không hiểu rõ chỉ vì thấy người khác khoe lãi.',
    ],
    appAction:
      'Luôn duy trì tỷ trọng tài sản phòng thủ an toàn tối thiểu 50% trong tổng tài sản cá nhân của bạn.',
    keyTakeaways: [
      'Đa dạng hóa là "bữa trưa miễn phí" duy nhất trong đầu tư tài chính.',
      'Mục tiêu của đa dạng hóa không phải là tối đa hóa lợi nhuận mà là tối thiểu hóa rủi ro phá sản.',
      'Chỉ đầu tư vào những lớp tài sản minh bạch, có cơ chế giám sát pháp lý rõ ràng.',
    ],
    references: 'Harry Markowitz - Modern Portfolio Theory (Nobel Prize in Economics 1990); Ray Dalio - Principles.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_5_3',
      question: 'Mục đích cốt lõi của nguyên tắc "Đừng bỏ tất cả trứng vào một giỏ" (Đa dạng hóa) là gì?',
      options: [
        'Phân tán rủi ro để bảo vệ tổng tài sản khi một kênh đầu tư gặp sự cố',
        'Làm tăng gấp 10 lần lợi nhuận trong thời gian ngắn nhất',
        'Bắt buộc bạn phải mua thật nhiều giỏ đựng trứng ở chợ',
        'Tránh phải trả tiền thuế thu nhập cá nhân',
      ],
      correctIndex: 0,
      explanation: 'Đa dạng hóa giúp giảm thiểu tối đa thiệt hại tổng thể khi một tài sản đơn lẻ gặp biến cố rủi ro.',
    },
  },
  {
    id: '5.4',
    chapterId: 5,
    order: 4,
    title: 'Tâm Lý Nhà Đầu Tư F0: Tránh Cạm Bẫy Đám Đông',
    subtitle: 'Làm chủ cảm xúc tham lam và sợ hãi trước những đợt sóng thị trường',
    duration: '6 phút',
    story:
      'Khi thấy mạng xã hội rần rần khoe lãi x2 x3 tài khoản, Hiếu vội vã nạp tiền mua ở ngay vùng đỉnh của thị trường vì sợ lỡ cơ hội làm giàu (FOMO). Đến khi thị trường điều chỉnh giảm 20%, Hiếu hoảng loạn bán tháo đúng đáy và mất 40% vốn.',
    coreConcept:
      'Thị trường tài chính vận hành theo chu kỳ tâm lý: Tham lam (Greed) ở vùng đỉnh và Sợ hãi (Fear) ở vùng đáy. Người mới (F0) thường hành động ngược lại với lý trí: Mua vì FOMO khi giá quá đắt và Bán tháo vì hoảng loạn khi giá về vùng hấp dẫn.',
    exampleVnd:
      'Khoản đầu tư 10 triệu bị cắt lỗ vội vàng ở đáy còn 6 triệu chỉ sau 2 tuần vì tâm lý hoảng loạn theo đám đông trên các hội nhóm mạng xã hội.',
    mistakes: [
      'Đầu tư dựa trên "phím hàng", tin đồn kín từ các hội nhóm chat không kiểm chứng.',
      'Kiểm tra bảng giá 50 lần mỗi ngày gây kiệt quệ tâm lý và dẫn đến quyết định bốc đồng.',
      'Sử dụng tiền vay mượn (Margin) khi chưa có kinh nghiệm quản trị rủi ro.',
    ],
    appAction:
      'Xác lập chiến lược tích lũy định kỳ (DCA - Dollar-Cost Averaging): Đầu tư một số tiền cố định vào một ngày cố định mỗi tháng, bỏ qua biến động cảm xúc ngắn hạn.',
    keyTakeaways: [
      'Thị trường là thiết bị chuyển tiền từ người thiếu kiên nhẫn sang người có kỷ luật.',
      'Khi đám đông đang hưng phấn tột độ là lúc bạn cần cẩn trọng nhất.',
      'Tập trung nâng cao kiến thức và năng lực cốt lõi thay vì tìm kiếm đường tắt làm giàu nhanh.',
    ],
    references: 'Warren Buffett - Bức thư gửi cổ đông; Philip Fisher - Common Stocks and Uncommon Profits.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_5_4',
      question: 'Chiến lược đầu tư định kỳ kỷ luật (DCA - Dollar-Cost Averaging) giúp ích gì cho người học?',
      options: [
        'Mua tích lũy đều đặn số tiền cố định theo thời gian, loại bỏ cảm xúc mua đỉnh bán đáy theo đám đông',
        'Đảm bảo trúng số độc đắc 100% vào cuối tháng',
        'Giúp vay được tiền ngân hàng với lãi suất 0%',
        'Làm tăng giá trị của mọi loại tài sản lên gấp 10 lần',
      ],
      correctIndex: 0,
      explanation: 'Chiến lược DCA giúp trung bình hóa giá vốn và loại bỏ hoàn toàn bẫy tâm lý tham lam - sợ hãi của thị trường.',
    },
  },
];

export const CHAPTER_6_LESSONS = [
  {
    id: '6.1',
    chapterId: 6,
    order: 1,
    title: 'Bẫy "Việc Nhẹ Lương Cao" & Lừa Đảo Giật Đơn Hàng',
    subtitle: 'Giải mã chiêu trò nạp tiền làm nhiệm vụ kiếm hoa hồng trên mạng',
    duration: '6 phút',
    story:
      'Nhận được tin nhắn tuyển "Cộng tác viên xử lý đơn hàng Shopee/TikTok hoa hồng 20%", Trang thử nạp 100k và nhận lại 120k thật. Tin tưởng, Trang nạp tiếp các nhiệm vụ 2 triệu, 5 triệu, rồi 15 triệu. Lúc này đối tượng báo "lỗi hệ thống, phải nạp thêm 30 triệu để mở khóa rút tiền" và chiếm đoạt toàn bộ.',
    coreConcept:
      'Mô hình lừa đảo nhiệm vụ thao túng tâm lý bằng cách cho "ăn mồi nhỏ" ban đầu để tạo lòng tin (Hiệu ứng Cam kết & Nhất quán). Sau đó, đối tượng dùng chiêu trò kẹt tiền để kích hoạt bẫy "Chi phí chìm" (Sunk Cost Fallacy), khiến nạn nhân liên tục nạp thêm tiền để mong lấy lại số tiền đã mất.',
    exampleVnd:
      'Tổng số tiền bị chiếm đoạt: 22.000.000 đ tích cóp cả năm đi làm thêm sinh viên chỉ trong vòng 3 tiếng đồng hồ.',
    mistakes: [
      'Tin vào những lời mời chào công việc trực tuyến không đòi hỏi chuyên môn nhưng thu nhập cao bất thường.',
      'Chuyển tiền vào tài khoản cá nhân của người lạ với lời hứa "hoàn vốn kèm lãi".',
      'Cố gắng nạp thêm tiền để chuộc lại số tiền đang bị treo trên các website lạ.',
    ],
    appAction:
      'Ghi nhớ quy tắc thép: Bất kỳ công việc nào yêu cầu bạn PHẢI NẠP TIỀN TRƯỚC để nhận hoa hồng đều là LỪA ĐẢO 100%.',
    keyTakeaways: [
      'Không có công việc nào "việc nhẹ lương cao nạp tiền làm nhiệm vụ" là có thật.',
      'Cắt lỗ tâm lý ngay lập tức khi phát hiện dấu hiệu lừa đảo; tuyệt đối không nạp thêm tiền.',
      'Cảnh giác với mọi tin nhắn, lời mời từ các tài khoản ẩn danh trên Telegram/Zalo.',
    ],
    references: 'Cục An toàn Thông tin - Bộ Thông tin & Truyền thông (Cảnh báo 24 hình thức lừa đảo trực tuyến phổ biến tại Việt Nam 2024).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_6_1',
      question: 'Dấu hiệu nhận biết rõ ràng nhất của một chiêu trò lừa đảo tuyển dụng trực tuyến là gì?',
      options: [
        'Yêu cầu người tìm việc phải chuyển khoản nạp tiền trước để làm nhiệm vụ hoặc nhận hoa hồng',
        'Có hợp đồng lao động rõ ràng và phỏng vấn trực tiếp tại văn phòng công ty',
        'Yêu cầu bằng cấp và kỹ năng chuyên môn phù hợp với vị trí công việc',
        'Trả lương cố định hàng tháng qua tài khoản ngân hàng chính thức',
      ],
      correctIndex: 0,
      explanation: 'Mọi hình thức tuyển dụng yêu cầu ứng viên nạp tiền trước đều là hành vi lừa đảo chiếm đoạt tài sản.',
    },
  },
  {
    id: '6.2',
    chapterId: 6,
    order: 2,
    title: 'Bảo Mật Tài Khoản: Quy Tắc 2 Lớp & Phòng Chống Mất OTP',
    subtitle: 'Bảo vệ thành trì tài khoản ngân hàng và ví điện tử của bạn',
    duration: '5 phút',
    story:
      'Nhận cuộc gọi tự xưng "Tổng đài viên ngân hàng hỗ trợ khóa giao dịch lạ", Nam được yêu cầu đọc mã OTP gửi về máy để "xác minh hủy lệnh". Vừa đọc xong 6 chữ số OTP, toàn bộ 8.500.000 đ trong tài khoản của Nam bị chuyển sạch sang tài khoản khác.',
    coreConcept:
      'Mã OTP (One-Time Password) và Smart OTP là chìa khóa két sắt cuối cùng xác thực giao dịch chuyển tiền. Ngân hàng và các tổ chức tài chính chính thống KHÔNG BAO GIỜ yêu cầu khách hàng cung cấp mã OTP dưới bất kỳ hình thức nào.',
    exampleVnd:
      'Mất 8.500.000 đ trong vòng 30 giây chỉ vì một phút mất cảnh giác đọc mã số OTP cho người lạ qua điện thoại.',
    mistakes: [
      'Đọc mã OTP hoặc mật khẩu đăng nhập cho bất kỳ ai, kể cả người tự xưng là công an hay nhân viên ngân hàng.',
      'Bấm vào các đường link lạ mạo danh giao diện đăng nhập ngân hàng (Phishing).',
      'Đặt mật khẩu ứng dụng ngân hàng quá đơn giản (ngày sinh, 123456).',
    ],
    appAction:
      'Cài đặt xác thực sinh trắc học (FaceID/Vân tay) cho toàn bộ app ngân hàng. Luôn kiểm tra kỹ nội dung tin nhắn SMS chứa OTP (xem rõ số tiền và người nhận).',
    keyTakeaways: [
      'Mã OTP là chìa khóa nhà của bạn; tuyệt đối không bao giờ đưa cho người lạ.',
      'Ngân hàng không bao giờ gọi điện yêu cầu cung cấp mật khẩu hay mã OTP.',
      'Khi nghi ngờ bị lộ thông tin, hãy lập tức khóa thẻ khẩn cấp trên app ngân hàng.',
    ],
    references: 'Quyết định 2345/QĐ-NHNN về triển khai các giải pháp an toàn, bảo mật trong thanh toán trực tuyến và thanh toán thẻ ngân hàng.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_6_2',
      question: 'Khi nhận được cuộc gọi xưng là nhân viên ngân hàng yêu cầu đọc mã OTP để hủy giao dịch, bạn cần làm gì?',
      options: [
        'Cúp máy ngay lập tức, tuyệt đối không cung cấp OTP và liên hệ hotline chính thức của ngân hàng để kiểm tra',
        'Đọc ngay mã OTP để được hỗ trợ nhanh nhất',
        'Chụp ảnh CCCD gửi qua Zalo cho người gọi',
        'Chuyển toàn bộ tiền sang tài khoản do người gọi cung cấp để nhờ giữ hộ',
      ],
      correctIndex: 0,
      explanation: 'Không một ngân hàng nào yêu cầu cung cấp OTP. Mọi yêu cầu đọc OTP qua điện thoại đều là hành vi lừa đảo.',
    },
  },
  {
    id: '6.3',
    chapterId: 6,
    order: 3,
    title: 'Bảo Hiểm Cơ Bản: Tấm Khiên Chống Đỡ Rủi Ro Sức Khỏe',
    subtitle: 'Phân biệt giữa Bảo hiểm Y tế Nhà nước và các gói bảo vệ cần thiết',
    duration: '6 phút',
    story:
      'Hồi sinh viên, Long nghĩ mình khỏe mạnh nên không mua Bảo hiểm Y tế (BHYT). Đến khi bị viêm ruột thừa cấp phải mổ cấp cứu tại bệnh viện tuyến trên, tổng viện phí và thuốc men lên tới 18.000.000 đ, Long phải tự chi trả 100% tiền túi.',
    coreConcept:
      'Bảo hiểm (Insurance) là công cụ chuyển giao rủi ro tài chính lớn cho đơn vị bảo hiểm với một mức phí nhỏ định kỳ. BHYT toàn dân là lá chắn sinh tồn cơ bản nhất mà mọi người trẻ bắt buộc phải duy trì liên tục.',
    exampleVnd:
      'Thẻ BHYT chi phí khoảng 800.000 đ – 1.000.000 đ/năm đã chi trả tới 80%–100% chi phí điều trị trong trường hợp phẫu thuật 18.000.000 đ, giúp tiết kiệm hơn 14 triệu đồng tiền mặt.',
    mistakes: [
      'Để thẻ BHYT hết hạn mà không gia hạn kịp thời.',
      'Mua các gói bảo hiểm nhân thọ tích lũy phức tạp vượt quá 10% tổng thu nhập hàng năm.',
      'Xem bảo hiểm là kênh đầu tư sinh lời thay vì công cụ phòng vệ rủi ro.',
    ],
    appAction:
      'Kiểm tra hạn sử dụng thẻ BHYT trên ứng dụng VssID và cài lịch gia hạn trước khi hết hạn 30 ngày.',
    keyTakeaways: [
      'Bảo hiểm Y tế là lá chắn bảo vệ sức khỏe và tài chính tối thiểu bắt buộc phải có.',
      'Bảo hiểm sinh ra để bảo vệ trước rủi ro, không phải để làm giàu hay đầu tư sinh lời.',
      'Chi phí bảo hiểm chỉ nên chiếm từ 5%–10% tổng thu nhập hàng năm của bạn.',
    ],
    references: 'Luật Bảo hiểm Y tế số 25/2008/QH12 và các văn bản hướng dẫn thi hành; Báo cáo Bảo hiểm Xã hội Việt Nam.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_6_3',
      question: 'Ý nghĩa quan trọng nhất của việc tham gia Bảo hiểm Y tế (BHYT) là gì?',
      options: [
        'Chuyển giao và giảm thiểu gánh nặng chi phí khám chữa bệnh khi không may gặp biến cố sức khỏe',
        'Để kiếm tiền lãi cao gấp đôi sau 1 năm',
        'Để được miễn phí vé xem phim và hòa nhạc',
        'Để vay tiền ngân hàng không cần thế chấp',
      ],
      correctIndex: 0,
      explanation: 'BHYT bảo vệ bạn khỏi nguy cơ kiệt quệ tài chính trước các chi phí điều trị y tế đắt đỏ khi ốm đau, tai nạn.',
    },
  },
  {
    id: '6.4',
    chapterId: 6,
    order: 4,
    title: 'Quyền Riêng Tư & Bảo Vệ Dữ Liệu Cá Nhân (Nghị Định 13)',
    subtitle: 'Tại sao thông tin danh tính của bạn là mỏ vàng đối với các đối tượng xấu',
    duration: '5 phút',
    story:
      'Để nhận voucher trà sữa 20k, Minh quét mã QR và điền toàn bộ Họ tên, Ngày sinh, Số CCCD, và Số điện thoại vào một website lạ. Vài tuần sau, Minh liên tục bị gọi điện quấy rối đòi nợ và phát hiện danh tính của mình bị dùng để đăng ký SIM rác và tài khoản lừa đảo.',
    coreConcept:
      'Dữ liệu cá nhân (CCCD, số điện thoại, khuôn mặt, địa chỉ) là tài sản định danh số của bạn. Theo Nghị định 13/2023/NĐ-CP, bạn có quyền kiểm soát, yêu cầu xóa dữ liệu và không cung cấp thông tin nhạy cảm cho các đơn vị không rõ thẩm quyền.',
    exampleVnd:
      'Đổi thông tin nhạy cảm lấy voucher 20.000 đ nhưng gánh chịu rủi ro bị mạo danh danh tính và tổn hại uy tín cá nhân trong nhiều năm.',
    mistakes: [
      'Chụp ảnh 2 mặt thẻ CCCD công khai lên mạng xã hội hoặc gửi cho người lạ.',
      'Cung cấp thông tin cá nhân bừa bãi tại các sự kiện tặng quà miễn phí không rõ nguồn gốc.',
      'Cài đặt các ứng dụng đòi hỏi quyền truy cập danh bạ, vị trí, micro không cần thiết.',
    ],
    appAction:
      'Mở ứng dụng Ví Mỏ Hỗn, trải nghiệm tính năng "Xóa dữ liệu 1-chạm" trong phần Hồ sơ để kiểm soát hoàn toàn quyền riêng tư của bạn theo NĐ 13/2023.',
    keyTakeaways: [
      'Thông tin cá nhân là tài sản số vô giá; đừng bao giờ đánh đổi lấy những món quà nhỏ.',
      'Tuyệt đối không đăng tải hình ảnh giấy tờ tùy thân lên mạng xã hội.',
      'Chủ động thực thi quyền bảo vệ dữ liệu cá nhân theo quy định của pháp luật.',
    ],
    references: 'Nghị định 13/2023/NĐ-CP của Chính phủ về Bảo vệ dữ liệu cá nhân; Luật An ninh mạng 2018.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_6_4',
      question: 'Theo Nghị định 13/2023/NĐ-CP, hành vi nào sau đây là an toàn để bảo vệ dữ liệu cá nhân của bạn?',
      options: [
        'Bảo mật thông tin CCCD, chỉ cung cấp cho cơ quan có thẩm quyền và kiểm soát quyền xóa dữ liệu cá nhân',
        'Đăng ảnh chụp 2 mặt CCCD lên Facebook để khoe vừa làm căn cước mới',
        'Điền số CCCD và thông tin gia đình vào mọi liên kết trúng thưởng trên mạng',
        'Cho người lạ mượn thẻ CCCD để đi đăng ký mở tài khoản ngân hàng',
      ],
      correctIndex: 0,
      explanation: 'Bảo mật thông tin định danh và chủ động thực thi quyền riêng tư giúp bạn phòng tránh triệt để các rủi ro bị mạo danh lừa đảo.',
    },
  },
];

export const CHAPTER_7_LESSONS = [
  {
    id: '7.1',
    chapterId: 7,
    order: 1,
    title: 'Năng Suất Lao Động: Cách Gia Tăng Thu Nhập Từ Gốc Rễ',
    subtitle: 'Vì sao nâng cao giá trị mỗi giờ làm việc quan trọng hơn việc cày thêm giờ',
    duration: '6 phút',
    story:
      'Hòa làm việc 14 tiếng/ngày với 2 công việc tay chân để kiếm 9 triệu/tháng và luôn trong tình trạng kiệt sức. Trong khi đó, Tú dành 2 tiếng mỗi ngày để học kỹ năng phân tích dữ liệu và ngoại ngữ. Sau 1 năm, Tú kiếm được 18 triệu/tháng chỉ với 8 tiếng làm việc mỗi ngày.',
    coreConcept:
      'Thời gian của mỗi người đều có giới hạn (24 giờ/ngày). Gia tăng thu nhập bằng cách "bán thêm thời gian" sẽ nhanh chóng chạm trần sinh học. Cách duy nhất để bứt phá thu nhập bền vững là nâng cao GIÁ TRỊ TẠO RA TRONG MỖI GIỜ LÀM VIỆC.',
    exampleVnd:
      'Làm việc 50.000 đ/giờ x 10 giờ = 500.000 đ/ngày. Nâng cao kỹ năng lên 150.000 đ/giờ x 6 giờ = 900.000 đ/ngày, vừa kiếm nhiều hơn 400.000 đ vừa có thêm thời gian nghỉ ngơi, phát triển.',
    mistakes: [
      'Chỉ tập trung cày cuốc bán sức lao động mà không dành thời gian nâng cấp bản thân.',
      'Nghĩ rằng làm việc càng nhiều giờ thì càng có giá trị mà không quan tâm đến kết quả đầu ra.',
      'Cắt giảm thời gian ngủ và sức khỏe để kiếm thêm vài đồng ngắn hạn.',
    ],
    appAction:
      'Thiết lập "Quỹ phát triển bản thân" trong app, trích 5%–10% thu nhập hàng tháng để mua sách, tham gia các khóa học nâng cao tay nghề.',
    keyTakeaways: [
      'Thu nhập của bạn phản ánh giá trị bạn mang lại cho thị trường, không phản ánh số giờ bạn ngồi ở văn phòng.',
      'Đầu tư vào kỹ năng bản thân là khoản đầu tư mang lại tỷ suất sinh lời cao nhất.',
      'Tập trung làm việc thông minh (Smart Work) thay vì chỉ làm việc kiệt sức (Hard Work).',
    ],
    references: 'Cal Newport - So Good They Can\'t Ignore You (2012); Gary Becker - Human Capital: A Theoretical and Empirical Analysis (Nobel Prize).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_7_1',
      question: 'Con đường bền vững nhất để gia tăng thu nhập cá nhân trong dài hạn là gì?',
      options: [
        'Nâng cao kỹ năng chuyên môn và giá trị tạo ra trong mỗi giờ làm việc',
        'Làm việc 20 tiếng/ngày không ngủ để tối đa hóa số giờ',
        'Trông chờ vào may mắn trúng vé số hoặc cờ bạc',
        'Vay nợ để tiêu xài cho bằng người khác',
      ],
      correctIndex: 0,
      explanation: 'Nâng cao giá trị chuyên môn trên mỗi giờ làm việc giúp bạn gia tăng thu nhập thực tế mà không hủy hoại sức khỏe thể chất.',
    },
  },
  {
    id: '7.2',
    chapterId: 7,
    order: 2,
    title: 'Bộ Kỹ Năng Thu Nhập Cao (High-Income Skills)',
    subtitle: 'Nhận diện những năng lực mà thị trường luôn sẵn sàng trả giá đắt',
    duration: '6 phút',
    story:
      'Cùng tốt nghiệp ngành kinh tế, Đạt chỉ làm các công việc văn phòng nhập liệu cơ bản (lương 7 triệu). Khang chủ động học thêm kỹ năng Viết nội dung thuyết phục (Copywriting), Chạy quảng cáo tối ưu dữ liệu và Ngoại ngữ giao tiếp chuyên ngành, giúp Khang nhận mức lương 22 triệu sau 2 năm.',
    coreConcept:
      'Kỹ năng thu nhập cao là những kỹ năng chuyên môn đặc thù có thể tạo ra doanh thu hoặc giải quyết vấn đề trực tiếp cho tổ chức (Bán hàng B2B, Lập trình, Thiết kế sản phẩm, Phân tích dữ liệu, Ngoại ngữ). Chúng khó bị thay thế và có tính chuyển đổi cao.',
    exampleVnd:
      'Chênh lệch thu nhập giữa kỹ năng cơ bản (7 triệu) và kỹ năng thu nhập cao (22 triệu) là 15.000.000 đ/tháng (180.000.000 đ/năm) — đủ tích lũy mua tài sản lớn chỉ sau vài năm.',
    mistakes: [
      'Học dàn trải mỗi thứ một ít mà không có một kỹ năng mũi nhọn nào đạt mức xuất sắc.',
      'Hài lòng với các kỹ năng thao tác lặp đi lặp lại dễ bị AI và tự động hóa thay thế.',
      'Không chịu thực hành tạo ra sản phẩm thực tế mà chỉ học lý thuyết suông.',
    ],
    appAction:
      'Chọn 1 kỹ năng có nhu cầu cao trong ngành của bạn và đặt mục tiêu rèn luyện 45 phút mỗi ngày liên tục trong 6 tháng.',
    keyTakeaways: [
      'Kỹ năng thu nhập cao là tài sản bảo hiểm tốt nhất cho sự nghiệp của bạn trước mọi biến động kinh tế.',
      'Kết hợp 2 kỹ năng tốt (ví dụ: Chuyên môn + Ngoại ngữ) tạo nên lợi thế cạnh tranh vượt trội.',
      'Học tập liên tục là yêu cầu bắt buộc trong thời đại công nghệ số.',
    ],
    references: 'Dan Lok - Unlock It: The Master Key to Wealth, Success, and Significance; Diễn đàn Kinh tế Thế giới (WEF - Future of Jobs Report 2023).',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_7_2',
      question: 'Đặc điểm chung của các Kỹ năng thu nhập cao (High-Income Skills) là gì?',
      options: [
        'Khó bị thay thế, giải quyết trực tiếp vấn đề kinh doanh then chốt và tạo ra giá trị gia tăng lớn',
        'Bất kỳ ai cũng có thể làm được mà không cần học tập rèn luyện',
        'Các công việc nhập liệu thủ công lặp đi lặp lại hàng ngày',
        'Những kỹ năng chỉ dùng được trong các trò chơi điện tử',
      ],
      correctIndex: 0,
      explanation: 'Kỹ năng thu nhập cao đòi hỏi sự rèn luyện chuyên sâu và mang lại giá trị kinh tế trực tiếp vượt trội cho thị trường.',
    },
  },
  {
    id: '7.3',
    chapterId: 7,
    order: 3,
    title: 'Xây Dựng Quỹ Đầu Tư Bản Thân (Self-Investment Fund)',
    subtitle: 'Khoản đầu tư duy nhất không bao giờ bị thị trường đánh sập hay lạm phát ăn mòn',
    duration: '5 phút',
    story:
      'Thay vì đổi điện thoại mới 20 triệu, Ngọc trích 8 triệu để mua khóa học chứng chỉ quốc tế và 2 triệu mua sách chuyên ngành. Chứng chỉ này giúp Ngọc nhận được học bổng thực tập tại một tập đoàn đa quốc gia với mức trợ cấp gấp 3 lần bạn bè cùng lớp.',
    coreConcept:
      'Quỹ đầu tư bản thân là khoản tiền được trích lập có chủ đích để nâng cao năng lực trí tuệ, sức khỏe thể chất và mạng lưới quan hệ chất lượng. Trí tuệ và kỹ năng là thứ duy nhất đi theo bạn suốt đời và không ai có thể tước đoạt.',
    exampleVnd:
      'Đầu tư 10.000.000 đ vào khóa học chuyên môn giúp tăng lương từ 8 triệu lên 14 triệu/tháng. Sau 1 năm thu về thêm 72.000.000 đ — tỷ suất sinh lời 720%/năm, vượt xa mọi kênh đầu tư tài chính.',
    mistakes: [
      'Tiếc tiền mua một cuốn sách hay khóa học vài trăm ngàn nhưng sẵn sàng chi tiền triệu ăn nhậu.',
      'Mua khóa học về để đó mà không bao giờ hoàn thành (tâm lý mua để giải tỏa cảm giác tội lỗi).',
      'Đầu tư vào các khóa học "làm giàu siêu tốc" lừa đảo của các diễn giả không có chuyên môn thực tế.',
    ],
    appAction:
      'Trích cố định 300.000 đ – 500.000 đ mỗi tháng vào mục tiêu "Học tập & Nâng cao kỹ năng" trong app Ví Mỏ Hỗn.',
    keyTakeaways: [
      'Đầu tư vào bản thân là khoản đầu tư thông minh nhất với tỷ suất sinh lời cao nhất.',
      'Sách và tri thức là chiếc đòn bẩy rẻ nhất để tiếp cận kinh nghiệm của những bộ óc vĩ đại.',
      'Học đi đôi với hành; áp dụng kiến thức vào thực tế để tạo ra kết quả cụ thể.',
    ],
    references: 'Warren Buffett - The Best Investment You Can Make Is in Yourself (Forbes Interview); Carol Dweck - Mindset: The New Psychology of Success.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_7_3',
      question: 'Vì sao đầu tư vào bản thân (học tập, kỹ năng, sức khỏe) được xem là khoản đầu tư tốt nhất?',
      options: [
        'Vì tri thức và kỹ năng thuộc quyền sở hữu của bạn vĩnh viễn, không bị mất giá bởi lạm phát và tạo ra dòng thu nhập tăng trưởng cả đời',
        'Vì nó giúp bạn kiếm được 1 tỷ đồng chỉ sau 1 đêm mà không cần làm gì',
        'Vì mua sách về để trưng bày sẽ làm căn phòng trông đẹp hơn',
        'Vì bạn có thể bán lại kiến thức cho bạn bè với giá gấp đôi',
      ],
      correctIndex: 0,
      explanation: 'Năng lực cá nhân là cội nguồn tạo ra mọi dòng tiền trong cuộc sống, không một biến cố thị trường nào có thể tước đoạt được.',
    },
  },
  {
    id: '7.4',
    chapterId: 7,
    order: 4,
    title: 'Tự Do Tài Chính: Hành Trình Của Sự Tự Chủ & Bình Yên',
    subtitle: 'Định nghĩa lại sự giàu có thực sự: Không phải là sở hữu nhiều đồ, mà là làm chủ thời gian',
    duration: '6 phút',
    story:
      'Sau 10 năm kiên trì thực hành ghi chép chi tiêu, kiểm soát FOMO, không nợ xấu và đều đặn tích lũy, Tuấn xây dựng được quỹ tài chính đủ trang trải 5 năm sinh hoạt cơ bản. Tuấn tự tin từ chối môi trường làm việc độc hại để chuyển sang theo đuổi công việc mình thực sự đam mê mà không lo lắng về tiền ăn tháng tới.',
    coreConcept:
      'Tự do tài chính (Financial Freedom) không phải là sự xa hoa hay nghỉ hưu sớm để ăn chơi. Bản chất của tự do tài chính là quyền tự chủ: Bạn làm việc vì đam mê và giá trị cống hiến, chứ không phải vì bị ép buộc bởi những hóa đơn nợ nần đến hạn.',
    exampleVnd:
      'Sự tự do bắt đầu từ mốc 3 tháng chi phí sinh hoạt (12 triệu), tiến tới 1 năm (48 triệu), và đạt tới sự độc lập khi tài sản tích lũy tạo ra dòng tiền bền vững bảo vệ bạn suốt đời.',
    mistakes: [
      'Nghĩ rằng tự do tài chính là phải có hàng chục tỷ đồng mới đạt được.',
      'Đánh đổi sức khỏe, đạo đức và các mối quan hệ quý giá chỉ để tích lũy con số trên tài khoản.',
      'Quên tận hưởng những niềm vui giản dị trong hành trình rèn luyện mỗi ngày.',
    ],
    appAction:
      'Mỗi ngày mở app Ví Mỏ Hỗn: Ghi 1 khoản chi, giữ ngân sách ngày dưới 100%, đọc 1 bài học và tự hào về sự tiến bộ kỷ luật của chính mình.',
    keyTakeaways: [
      'Kỷ luật tài chính không phải là sự trói buộc; kỷ luật chính là chiếc chìa khóa mở ra cánh cửa tự do thực sự.',
      'Hành trình vạn dặm bắt đầu từ việc kiểm soát một ly trà sữa 45k hôm nay.',
      'Chúc mừng bạn đã hoàn thành trọn vẹn 7 Chương Giáo Trình Tài Chính của Ví Mỏ Hỗn!',
    ],
    references: 'Vicki Robin - Your Money or Your Life (2018); J.L. Collins - The Simple Path to Wealth; Morgan Housel - The Psychology of Money.',
    legalDisclaimer: 'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_7_4',
      question: 'Ý nghĩa cao đẹp và chân thực nhất của Tự do tài chính là gì?',
      options: [
        'Làm chủ thời gian và cuộc sống của chính mình, có quyền lựa chọn công việc và lối sống ý nghĩa mà không bị áp lực nợ nần đè nặng',
        'Có thật nhiều tiền để mua tất cả đồ xa xỉ trên thế giới nhằm khoe khoang với người khác',
        'Nghỉ việc hoàn toàn và nằm ngủ cả ngày không làm gì',
        'Không bao giờ phải nói chuyện với bất kỳ ai nữa',
      ],
      correctIndex: 0,
      explanation: 'Tự do tài chính mang lại sự bình yên nội tại và quyền tự chủ tuyệt đối với thời gian quý báu của cuộc đời bạn.',
    },
  },
];
