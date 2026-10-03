/**
 * GIÁO TRÌNH CHƯƠNG 1: GIẢI MÃ DÒNG TIỀN & BẢN ĐỒ THU CHI
 * Tuân thủ nghiêm ngặt quy chuẩn cấu trúc 7 phần tại docs/LESSONS.md
 */

export const CHAPTER_1_LESSONS = [
  {
    id: '1.1',
    chapterId: 1,
    order: 1,
    title: 'Quy tắc 24 giờ trước cám dỗ Mega Sale',
    subtitle: 'Hạ nhiệt cơn sốt Dopamine khi săn sale trực tuyến',
    duration: '5 phút',
    story:
      '23h45 đêm 11/11, điện thoại liên tục rung thông báo voucher giảm giá 50% sắp hết hạn trong 15 phút. Bạn chuẩn bị bấm "Thanh toán" đơn hàng 450.000 đ cho chiếc tai nghe dự phòng dù tai nghe cũ vẫn đang dùng rất tốt.',
    coreConcept:
      'Khi nhìn thấy nhãn "Giảm 50%", não bộ tiết ra lượng lớn Dopamine tạo cảm giác hưng phấn như vừa thắng được một món hời. Bạn nhầm tưởng mình đang "tiết kiệm được 200.000 đ từ giá gốc", nhưng thực tế ví tiền của bạn vừa mất trắng 450.000 đ tiền mặt.',
    exampleVnd:
      '450.000 đ tương đương với 11 ngày tiền ăn sáng cà phê (40.000 đ/ngày) hoặc chiếm tới 15% hạn mức chi tiêu ăn uống của bạn trong cả tháng. Mua món đồ không cần thiết chỉ vì giảm giá là lãng phí 100% số tiền bỏ ra.',
    mistakes: [
      'Nghĩ rằng "không mua bây giờ thì lỗ to" mà quên rằng nhu cầu thực tế bằng 0.',
      'Bỏ thêm món đồ 100k vào giỏ chỉ để được freeship 25k.',
      'Thức khuya săn sale lúc lý trí kiệt sức và dễ ra quyết định bốc đồng nhất.',
    ],
    appAction:
      'Khi chuẩn bị bấm mua đồ trên mạng, hãy mở tab Ghi Nhanh [+] chọn "Hỏi AI Coach" để đối chiếu với Ngân sách ngày hôm nay. Áp dụng quy tắc trì hoãn 24h: Bỏ vào giỏ hàng và đi ngủ, sáng hôm sau nếu vẫn thấy cần thì mới cân nhắc mua.',
    keyTakeaways: [
      'Món đồ giảm 50% mà bạn không cần tức là bạn đã lãng phí 100% số tiền bỏ ra.',
      'Khoảng đệm thời gian 24 giờ là liều thuốc giải hiệu quả nhất cho mọi quyết định mua sắm bốc đồng.',
      'Luôn quy đổi giá trị món đồ ra số ngày ngân sách thực tế trong ví của bạn.',
    ],
    references:
      'Daniel Kahneman - Thinking, Fast and Slow (2011); Báo cáo xu hướng hành vi tiêu dùng số của Deloitte Vietnam (2024).',
    legalDisclaimer:
      'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_1_1',
      question: 'Quy tắc 24 giờ trước khi mua sắm trực tuyến giúp bạn điều gì quan trọng nhất?',
      options: [
        'Hạ nhiệt hưng phấn Dopamine để đánh giá xem món đồ có thực sự cần thiết hay không',
        'Chờ người bán giảm giá thêm 80% vào ngày hôm sau',
        'Được sàn thương mại điện tử hoàn lại 100% tiền mặt',
        'Tăng điểm uy tín tài khoản mua hàng online',
      ],
      correctIndex: 0,
      explanation:
        'Trì hoãn 24 giờ giúp não bộ thoát khỏi cơn hưng phấn ngắn hạn (Dopamine), giúp bạn nhìn nhận rõ nhu cầu sử dụng thực tế.',
    },
  },
  {
    id: '1.2',
    chapterId: 1,
    order: 2,
    title: 'Thu nhập khả dụng thực tế: Đừng đếm cua trong lỗ',
    subtitle: 'Phân biệt giữa Thu nhập danh nghĩa và Tiền thực sự được phép tiêu',
    duration: '6 phút',
    story:
      'Minh vừa nhận lương thử việc 10.000.000 đ. Vừa thấy thông báo lương về tài khoản lúc sáng, tối đó Minh tự tin mời nhóm bạn đi ăn lẩu 1.200.000 đ và chốt đôi giày 1.500.000 đ. Đến ngày 15, Minh hoảng hốt khi tiền trọ và tiền bảo hiểm đến hạn mà tài khoản chỉ còn vỏn vẹn 800.000 đ.',
    coreConcept:
      'Thu nhập danh nghĩa (Gross/Net nhận về) không phải là số tiền bạn được tự do tiêu xài. Thu nhập khả dụng thực tế (Disposable Income) là số tiền còn lại SAU KHI đã trừ toàn bộ chi phí sinh tồn cố định (Tiền nhà, điện nước, ăn uống cơ bản, tiền trả nợ).',
    exampleVnd:
      'Lương nhận về: 10.000.000 đ.\n- Tiền trọ + điện nước: 3.200.000 đ\n- Tiền ăn tối thiểu (60k/ngày x 30): 1.800.000 đ\n- Xăng xe, cước mạng, gửi xe: 800.000 đ\n- Quỹ dự phòng bắt buộc: 1.000.000 đ\n=> Thu nhập khả dụng thực tế để mua sắm/giải trí chỉ còn: 3.200.000 đ (khoảng 105.000 đ/ngày).',
    mistakes: [
      'Tiêu xài thả ga vào tuần đầu nhận lương rồi ăn mì tôm 2 tuần cuối tháng.',
      'Xem các khoản chi cố định (tiền trọ, học phí) là việc "đến hạn rồi tính".',
      'Đánh đồng số dư tài khoản ngân hàng hiện có với số tiền được phép tiêu tự do.',
    ],
    appAction:
      'Ngay khi có thu nhập về, vào mục Sổ ví bấm [+] "Ghi Thu", sau đó kiểm tra ngay mục "Ngân sách ngày đề xuất" để biết chính xác hôm nay được tiêu tối đa bao nhiêu.',
    keyTakeaways: [
      'Tiền của bạn chỉ thực sự là của bạn sau khi đã thanh toán xong mọi nghĩa vụ sinh tồn.',
      'Chia nhỏ thu nhập khả dụng cho 30 ngày để tạo nhịp chi tiêu ổn định cả tháng.',
      'Chi tiêu cho bản thân chỉ bắt đầu sau khi các khoản thiết yếu đã được bảo đảm an toàn.',
    ],
    references:
      'Paul Samuelson & William Nordhaus - Economics (19th Edition); Niên giám thống kê thu nhập và chi tiêu hộ gia đình Việt Nam.',
    legalDisclaimer:
      'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_1_2',
      question: 'Thu nhập khả dụng thực tế (Disposable Income) được tính như thế nào?',
      options: [
        'Tổng thu nhập nhận về trừ đi toàn bộ chi phí sinh hoạt cố định và nghĩa vụ bắt buộc',
        'Tổng tiền lương ghi trên hợp đồng lao động',
        'Số tiền còn lại trong ví vào ngày cuối cùng của tháng',
        'Hạn mức thẻ tín dụng được ngân hàng cấp',
      ],
      correctIndex: 0,
      explanation:
        'Thu nhập khả dụng là phần tiền còn lại sau khi đã thanh toán tiền trọ, điện nước, ăn uống thiết yếu và các khoản trích lập bắt buộc.',
    },
  },
  {
    id: '1.3',
    chapterId: 1,
    order: 3,
    title: 'Chi phí rò rỉ vi mô: Lỗ rò nhỏ làm đắm thuyền lớn',
    subtitle: 'Nhận diện và bịt các lỗ thủng ngân sách 20k - 50k mỗi ngày',
    duration: '7 phút',
    story:
      'Lan luôn tự nhận mình là người tiết kiệm vì không bao giờ mua túi xách hàng hiệu hay đồ xa xỉ. Tuy nhiên mỗi ngày đi làm, Lan uống 1 ly trà sữa 45.000 đ, gọi ship đồ ăn vặt 35.000 đ và trả phí đăng ký 4 ứng dụng xem phim/nghe nhạc dù cả tháng không mở. Cuối tháng Lan vẫn không hiểu vì sao mình luôn hết sạch tiền.',
    coreConcept:
      'Hiệu ứng "Latte Factor" của David Bach chỉ ra rằng những khoản chi rất nhỏ (20k - 50k) lặp đi lặp lại hàng ngày không gây cảm giác đau ví tức thì, nhưng tích lũy theo tháng và năm sẽ bào mòn một phần tài sản khổng lồ.',
    exampleVnd:
      '1 ly trà sữa/cà phê sang: 45.000 đ/ngày x 30 ngày = 1.350.000 đ/tháng (16.200.000 đ/năm).\n3 gói subscription không dùng: 180.000 đ/tháng = 2.160.000 đ/năm.\nTổng rò rỉ: 18.360.000 đ/năm — đủ mua một chiếc laptop xịn hoặc chuyến du lịch trọn vẹn.',
    mistakes: [
      'Xem nhẹ các khoản chi dưới 50.000 đ và không ghi chép lại vào sổ.',
      'Đăng ký gói dùng thử miễn phí 7 ngày rồi quên hủy gia hạn tự động qua thẻ.',
      'Tặc lưỡi "có mấy chục ngàn đáng bao nhiêu" 5 lần một ngày.',
    ],
    appAction:
      'Mỗi khi phát sinh khoản chi nhỏ (kể cả 10k gửi xe, 20k bánh tráng), hãy bấm [+] ghi nhanh vào Sổ ví. Bật bộ lọc "Tháng này" để nhìn thấy tổng số tiền rò rỉ thực tế.',
    keyTakeaways: [
      'Sự giàu có bền vững bắt đầu từ việc kiểm soát các dòng rò rỉ vi mô hàng ngày.',
      'Rà soát và hủy ngay các ứng dụng thu phí định kỳ mà bạn không sử dụng hàng tuần.',
      'Ghi chép đầy đủ các khoản chi nhỏ là chìa khóa duy nhất để tìm ra nguyên nhân ví bị rỗng.',
    ],
    references:
      'David Bach - The Automatic Millionaire (2004); Báo cáo tài chính cá nhân thế hệ Z Đông Nam Á (Kantar 2023).',
    legalDisclaimer:
      'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_1_3',
      question: 'Khái niệm "Latte Factor" trong quản lý tài chính cá nhân cảnh báo điều gì?',
      options: [
        'Những khoản chi tiêu nhỏ lặp đi lặp lại hàng ngày tích lũy thành số tiền thất thoát rất lớn',
        'Khuyên mọi người tuyệt đối không bao giờ được uống cà phê',
        'Quy định về giá bán tối thiểu của các loại đồ uống',
        'Phương pháp pha chế cà phê tiết kiệm nhất',
      ],
      correctIndex: 0,
      explanation:
        'Latte Factor mô tả việc những khoản chi vụn vặt vô thức hàng ngày (như trà sữa, ăn vặt) âm thầm làm cạn kiệt ngân sách tích lũy của bạn.',
    },
  },
  {
    id: '1.4',
    chapterId: 1,
    order: 4,
    title: 'Thiết lập Ngân sách ngày để sống sót cuối tháng',
    subtitle: 'Phương pháp chia nhỏ hạn mức chi tiêu để không bao giờ rỗng túi',
    duration: '5 phút',
    story:
      'Trước đây, Hùng thường đặt mục tiêu chung chung: "Tháng này cố gắng chỉ tiêu 5 triệu". Nhưng vì không có hạn mức từng ngày, tuần đầu Hùng tiêu 2.5 triệu, tuần hai tiêu 2 triệu, và 2 tuần còn lại phải vay mượn bạn bè 500k để cầm cự.',
    coreConcept:
      'Bộ não con người rất kém trong việc ước lượng dòng tiền trên khung thời gian dài (30 ngày). Ngân sách ngày (Daily Budget Pace) chuyển đổi mục tiêu lớn thành con số hành động cụ thể cho 24 giờ hôm nay: "Hôm nay tôi chỉ được tiêu tối đa X đồng".',
    exampleVnd:
      'Số dư ví hiện tại: 3.000.000 đ. Mục tiêu cần giữ cuối tháng: 1.500.000 đ. Còn 15 ngày đến cuối tháng.\nNgân sách ngày = (3.000.000 - 1.500.000) / 15 = 100.000 đ/ngày.\nNếu hôm nay chỉ tiêu 70.000 đ, ngày mai bạn có thể chi 130.000 đ mà vẫn 100% đạt mục tiêu.',
    mistakes: [
      'Đặt mục tiêu ngân sách theo tháng nhưng không theo dõi nhịp độ từng ngày.',
      'Khi lỡ tiêu lố hôm nay lại bỏ cuộc và thả trôi chi tiêu cho đến hết tháng.',
      'Không tự động dàn đều phần tiền chi lố sang các ngày tiếp theo.',
    ],
    appAction:
      'Kiểm tra thẻ "Ngân sách cho phép hôm nay" ngay trên Trang chủ mỗi sáng. Nếu thanh tiến độ hiển thị màu Xanh lá (dưới 70%), bạn đang hoàn toàn an toàn.',
    keyTakeaways: [
      'Kiểm soát từng ngày là cách duy nhất để kiểm soát cả tháng.',
      'Khi tiêu vượt hôm nay, đừng nản lòng; hãy để app tự động dàn đều phần thiếu sang các ngày tới.',
      'Kỷ luật tài chính không phải là khắc khổ, mà là chi tiêu có ý thức và trong tầm kiểm soát.',
    ],
    references:
      'Thomas J. Stanley & William D. Danko - The Millionaire Next Door (1996); Thống kê phương pháp ngân sách phong bì hiện đại của CFP Board.',
    legalDisclaimer:
      'Nội dung bài học nhằm mục đích giáo dục kiến thức tài chính cá nhân, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.',
    quiz: {
      id: 'q_1_4',
      question: 'Khi bạn lỡ chi vượt ngân sách ngày hôm nay, giải pháp kỷ luật đúng đắn nhất là gì?',
      options: [
        'Dàn đều phần tiền vượt sang các ngày còn lại và điều chỉnh giảm nhẹ mức chi các ngày tới',
        'Bỏ cuộc và tiếp tục tiêu xài không kiểm soát',
        'Vay tiền nóng lãi suất cao để bù vào ví',
        'Nhịn ăn hoàn toàn vào ngày hôm sau',
      ],
      correctIndex: 0,
      explanation:
        'Dàn đều phần thâm hụt sang các ngày còn lại giúp bạn bảo vệ mục tiêu tích lũy tháng mà không gây sốc cho sinh hoạt hàng ngày.',
    },
  },
];
