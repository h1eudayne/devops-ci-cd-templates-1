// Glossary translations and definitions for system design terms
const GLOSSARY_DATA = {
  "scalability": {
    "vi": "Khả năng mở rộng",
    "def": "Khả năng của hệ thống tăng trưởng để đáp ứng tải trọng cao hơn mà không ảnh hưởng hiệu suất."
  },
  "scaling": {
    "vi": "Mở rộng quy mô",
    "def": "Tăng khả năng xử lý của hệ thống (bằng cách nâng cấp phần cứng hoặc thêm máy chủ)."
  },
  "horizontal scaling": {
    "vi": "Mở rộng theo chiều ngang",
    "def": "Thêm nhiều máy chủ mới vào hệ thống để chia sẻ tải trọng."
  },
  "vertical scaling": {
    "vi": "Mở rộng theo chiều dọc",
    "def": "Nâng cấp tài nguyên (CPU, RAM, Ổ cứng) của máy chủ hiện tại."
  },
  "horizontal": {
    "vi": "Chiều ngang",
    "def": "Phân tán tải trọng bằng cách bổ sung thêm máy chủ mới."
  },
  "vertical": {
    "vi": "Chiều dọc",
    "def": "Nâng cấp tài nguyên (CPU, RAM) của máy chủ đơn lẻ hiện tại."
  },
  "load balancer": {
    "vi": "Bộ cân bằng tải",
    "def": "Thiết bị hoặc phần mềm phân phối lưu lượng truy cập mạng đến nhiều máy chủ khác nhau."
  },
  "latency": {
    "vi": "Độ trễ",
    "def": "Thời gian cần thiết để một gói tin dữ liệu hoặc yêu cầu đi từ nguồn đến đích."
  },
  "throughputs": {
    "vi": "Hiệu suất xử lý",
    "def": "Số lượng yêu cầu hoặc khối lượng dữ liệu được hệ thống xử lý thành công trong một đơn vị thời gian."
  },
  "throughput": {
    "vi": "Hiệu suất xử lý",
    "def": "Số lượng yêu cầu hoặc khối lượng dữ liệu được hệ thống xử lý thành công trong một đơn vị thời gian."
  },
  "sharding": {
    "vi": "Phân mảnh DB",
    "def": "Kỹ thuật chia nhỏ cơ sở dữ liệu lớn thành nhiều phần nhỏ (shard) trên các máy chủ vật lý khác nhau."
  },
  "replication": {
    "vi": "Nhân bản",
    "def": "Sao chép dữ liệu liên tục sang nhiều máy chủ (Master-Slave) để tăng tính dự phòng và tốc độ đọc."
  },
  "cache": {
    "vi": "Bộ nhớ đệm",
    "def": "Vùng lưu trữ dữ liệu tạm thời (thường trên RAM) để truy xuất nhanh chóng mà không cần gọi DB."
  },
  "caching": {
    "vi": "Bộ nhớ đệm",
    "def": "Vùng lưu trữ dữ liệu tạm thời (thường trên RAM) để truy xuất nhanh chóng mà không cần gọi DB."
  },
  "cdn": {
    "vi": "Mạng phân phối nội dung",
    "def": "Content Delivery Network - Mạng lưới máy chủ phân tán địa lý để cache và phân phối file tĩnh nhanh hơn."
  },
  "stateless": {
    "vi": "Không lưu trạng thái",
    "def": "Thiết kế Web server không lưu dữ liệu phiên (session) của client, giúp dễ dàng mở rộng quy mô."
  },
  "stateful": {
    "vi": "Có lưu trạng thái",
    "def": "Thiết kế server duy trì dữ liệu phiên của client giữa các yêu cầu liên tiếp."
  },
  "message queue": {
    "vi": "Hàng đợi tin nhắn",
    "def": "Hệ thống lưu giữ các thông điệp truyền thông không đồng bộ giữa các service (như Kafka, RabbitMQ)."
  },
  "spof": {
    "vi": "Điểm lỗi đơn lẻ",
    "def": "Single Point of Failure - Bộ phận độc nhất trong hệ thống mà nếu nó hỏng, toàn bộ hệ thống sẽ sụp đổ."
  },
  "consistency": {
    "vi": "Tính nhất quán",
    "def": "Đảm bảo tất cả các máy chủ hoặc bản sao dữ liệu đều đọc được cùng một giá trị dữ liệu mới nhất."
  },
  "availability": {
    "vi": "Tính khả dụng",
    "def": "Khả năng hệ thống luôn sẵn sàng phản hồi các yêu cầu từ phía người dùng mà không bị gián đoạn."
  },
  "fault tolerance": {
    "vi": "Khả năng chịu lỗi",
    "def": "Thuộc tính giúp hệ thống tiếp tục vận hành bình thường ngay cả khi có một số node hoặc phần cứng bị lỗi."
  },
  "consistent hashing": {
    "vi": "Băm nhất quán",
    "def": "Thuật toán băm giúp giảm thiểu việc phân bổ lại dữ liệu khi thêm hoặc bớt các máy chủ lưu trữ."
  },
  "rate limiter": {
    "vi": "Bộ giới hạn tần suất",
    "def": "Thành phần kiểm soát và giới hạn số lượng yêu cầu mà một người dùng/IP gửi đến API trong một khoảng thời gian."
  },
  "key-value store": {
    "vi": "Kho lưu trữ khóa - giá trị",
    "def": "Cơ sở dữ liệu NoSQL lưu trữ dữ liệu dưới dạng các cặp key-value đơn giản (như Redis, DynamoDB)."
  },
  "heartbeat": {
    "vi": "Nhịp tim hệ thống",
    "def": "Cơ chế gửi tín hiệu định kỳ giữa các máy chủ để giám sát trạng thái hoạt động trực tuyến của nhau."
  },
  "event sourcing": {
    "vi": "Thu thập sự kiện",
    "def": "Kỹ thuật lưu trữ tất cả các thay đổi trạng thái của hệ thống dưới dạng một chuỗi các sự kiện không thể thay đổi."
  },
  "multicast": {
    "vi": "Truyền đa hướng",
    "def": "Phương thức truyền tin từ một nguồn tới một nhóm các máy thu cụ thể trong mạng cùng một lúc."
  },
  "unicast": {
    "vi": "Truyền đơn hướng",
    "def": "Phương thức truyền tin từ một nguồn tới một điểm đích duy nhất."
  },
  "broadcast": {
    "vi": "Truyền quảng bá",
    "def": "Phương thức truyền tin từ một nguồn tới toàn bộ các node trong cùng mạng cục bộ."
  },
  "dns": {
    "vi": "Hệ thống phân giải tên miền",
    "def": "Domain Name System - Dịch vụ phân giải tên miền thân thiện (e.g. google.com) thành địa chỉ IP máy chủ."
  },
  "active-passive": {
    "vi": "Chủ động - Bị động",
    "def": "Mô hình dự phòng trong đó một node chính xử lý tải trọng, node phụ chờ sẵn để thay thế khi node chính lỗi."
  },
  "active": {
    "vi": "Chủ động / Hoạt động",
    "def": "Trạng thái thành phần đang chạy và xử lý yêu cầu hoặc người dùng đang sử dụng hệ thống."
  },
  "passive": {
    "vi": "Bị động / Dự phòng",
    "def": "Trạng thái thành phần chờ sẵn (standby) để thay thế khi thành phần chính bị lỗi."
  },
  "redundancy": {
    "vi": "Tính dự phòng",
    "def": "Việc lắp đặt nhiều thiết bị hoặc chạy nhiều bản sao dịch vụ giống nhau để phòng ngừa sự cố mất mát."
  },
  "microservices": {
    "vi": "Kiến trúc vi dịch vụ",
    "def": "Phương pháp phát triển phần mềm bằng cách chia nhỏ hệ thống thành các dịch vụ độc lập giao tiếp qua mạng."
  },
  "monolith": {
    "vi": "Kiến trúc nguyên khối",
    "def": "Mô hình ứng dụng truyền thống trong đó tất cả các module nghiệp vụ được đóng gói và chạy chung một tiến trình."
  },
  "shards": {
    "vi": "Phân mảnh DB",
    "def": "Các phần dữ liệu nhỏ được phân chia từ một cơ sở dữ liệu lớn để đặt trên các server khác nhau."
  },
  "shard": {
    "vi": "Mảnh dữ liệu",
    "def": "Một phần nhỏ cơ sở dữ liệu được phân chia ra từ database lớn."
  },
  "failover": {
    "vi": "Chuyển dự phòng",
    "def": "Quá trình tự động chuyển sang máy chủ dự phòng khi máy chủ chính gặp sự cố."
  },
  "read-intensive": {
    "vi": "Tải đọc lớn",
    "def": "Đặc trưng của ứng dụng có tần suất đọc dữ liệu (Queries) cao hơn rất nhiều so với ghi (Writes)."
  },
  "write-intensive": {
    "vi": "Tải ghi lớn",
    "def": "Đặc trưng hệ thống có tần suất ghi/cập nhật dữ liệu rất cao."
  },
  "single server setup": {
    "vi": "Thiết lập máy chủ đơn",
    "def": "Hệ thống chạy toàn bộ các thành phần (web, database, cache) trên một máy chủ duy nhất."
  },
  "single server": {
    "vi": "Máy chủ đơn lẻ",
    "def": "Hệ thống chạy toàn bộ các thành phần trên một máy chủ vật lý duy nhất."
  },
  "multi-server": {
    "vi": "Đa máy chủ",
    "def": "Thiết lập phân tách các thành phần hệ thống sang nhiều máy chủ khác nhau để tăng hiệu suất và khả năng chịu lỗi."
  },
  "multiple server": {
    "vi": "Đa máy chủ",
    "def": "Thiết lập phân tách các thành phần hệ thống sang nhiều máy chủ khác nhau để tăng hiệu suất và khả năng chịu lỗi."
  },
  "server": {
    "vi": "Máy chủ",
    "def": "Thiết bị vật lý hoặc tiến trình dịch vụ cung cấp chức năng cho các client."
  },
  "client": {
    "vi": "Máy khách",
    "def": "Thành phần người dùng hoặc ứng dụng gửi yêu cầu tài nguyên tới server."
  },
  "database": {
    "vi": "Cơ sở dữ liệu",
    "def": "Hệ thống lưu trữ và truy xuất dữ liệu có tổ chức (như SQL hoặc NoSQL)."
  },
  "master": {
    "vi": "Chính / Chủ",
    "def": "Máy chủ chính chịu trách nhiệm ghi dữ liệu và đồng bộ xuống các máy chủ phụ."
  },
  "slave": {
    "vi": "Phụ / Tớ",
    "def": "Máy chủ phụ chịu trách nhiệm đọc dữ liệu từ các yêu cầu của client để giảm tải máy chủ chính."
  },
  "bottleneck": {
    "vi": "Điểm nghẽn cổ chai",
    "def": "Thành phần có hiệu năng kém nhất trong luồng xử lý, làm giảm hiệu suất của toàn hệ thống."
  },
  "bottlenecks": {
    "vi": "Các điểm nghẽn cổ chai",
    "def": "Các thành phần có hiệu năng kém nhất trong luồng xử lý, làm giảm hiệu suất của toàn hệ thống."
  },
  "network latency": {
    "vi": "Độ trễ mạng",
    "def": "Thời gian cần thiết để một gói tin di chuyển qua mạng giữa client và server."
  },
  "database replication": {
    "vi": "Nhân bản cơ sở dữ liệu",
    "def": "Kỹ thuật sao chép dữ liệu từ một cơ sở dữ liệu sang các cơ sở dữ liệu khác để tăng tính dự phòng."
  },
  "data replication": {
    "vi": "Nhân bản dữ liệu",
    "def": "Sao chép dữ liệu liên tục sang nhiều máy chủ để đảm bảo tính an toàn và sẵn sàng cao."
  },
  "traffic redirection": {
    "vi": "Điều hướng lưu lượng",
    "def": "Kỹ thuật chuyển hướng yêu cầu của người dùng đến trung tâm dữ liệu hoặc máy chủ tối ưu nhất."
  },
  "data synchronization": {
    "vi": "Đồng bộ hóa dữ liệu",
    "def": "Đảm bảo tính nhất quán của dữ liệu giữa các máy chủ hoặc trung tâm dữ liệu khác nhau."
  },
  "automated deployment": {
    "vi": "Triển khai tự động",
    "def": "Quy trình sử dụng công cụ để tự động cài đặt và cập nhật ứng dụng lên máy chủ."
  },
  "db": {
    "vi": "Cơ sở dữ liệu (DB)",
    "def": "Database - Hệ thống lưu trữ dữ liệu có cấu trúc hoặc không cấu trúc."
  },
  "dbs": {
    "vi": "Cơ sở dữ liệu (DB)",
    "def": "Database - Hệ thống lưu trữ dữ liệu có cấu trúc hoặc không cấu trúc."
  },
  "microservice": {
    "vi": "Kiến trúc vi dịch vụ",
    "def": "Phương pháp phát triển phần mềm chia nhỏ hệ thống thành các dịch vụ độc lập giao tiếp qua mạng."
  },
  "monolithic": {
    "vi": "Kiến trúc nguyên khối",
    "def": "Mô hình ứng dụng truyền thống đóng gói tất cả các module nghiệp vụ trong một tiến trình duy nhất."
  },
  "write path": {
    "vi": "Luồng ghi dữ liệu",
    "def": "Chuỗi các thao tác mà hệ thống thực hiện khi ghi dữ liệu mới xuống bộ nhớ đệm và ổ đĩa."
  },
  "read path": {
    "vi": "Luồng đọc dữ liệu",
    "def": "Chuỗi các thao tác mà hệ thống thực hiện khi tìm kiếm và trả về dữ liệu cho client."
  },
  "vector clock": {
    "vi": "Đồng hồ vector",
    "def": "Thuật toán theo dõi thứ tự các sự kiện trong hệ thống phân tán để phát hiện xung đột phiên bản."
  },
  "vector clocks": {
    "vi": "Đồng hồ vector",
    "def": "Thuật toán theo dõi thứ tự các sự kiện trong hệ thống phân tán để phát hiện xung đột phiên bản."
  },
  "quorum consensus": {
    "vi": "Đồng thuận đa số",
    "def": "Cơ chế đảm bảo tính nhất quán dữ liệu bằng cách yêu cầu xác nhận từ một số lượng máy chủ tối thiểu."
  },
  "sloppy quorum": {
    "vi": "Đồng thuận đa số lỏng lẻo",
    "def": "Cơ chế quorum cho phép sử dụng các máy chủ tạm thời khi máy chủ chính bị lỗi để duy trì tính sẵn sàng."
  },
  "hinted handoff": {
    "vi": "Bàn giao gợi ý",
    "def": "Kỹ thuật lưu trữ tạm thời lệnh ghi trên máy chủ khác và gửi lại khi máy chủ chính hoạt động trở lại."
  },
  "bloom filter": {
    "vi": "Bộ lọc Bloom",
    "def": "Cấu trúc dữ liệu xác suất hiệu quả để kiểm tra xem một phần tử có chắc chắn không tồn tại hay không."
  },
  "bloom filters": {
    "vi": "Bộ lọc Bloom",
    "def": "Cấu trúc dữ liệu xác suất hiệu quả để kiểm tra xem một phần tử có chắc chắn không tồn tại hay không."
  },
  "merkle tree": {
    "vi": "Cây Merkle",
    "def": "Cây băm giúp so sánh và đồng bộ hóa dữ liệu giữa các máy chủ một cách nhanh chóng và hiệu quả."
  },
  "merkle trees": {
    "vi": "Cây Merkle",
    "def": "Cây băm giúp so sánh và đồng bộ hóa dữ liệu giữa các máy chủ một cách nhanh chóng và hiệu quả."
  },
  "commit log": {
    "vi": "Nhật ký cam kết",
    "def": "Tệp ghi nhật ký tuần tự các lệnh ghi dữ liệu trên đĩa trước khi cập nhật vào bộ nhớ để chống mất mát dữ liệu."
  },
  "memtable": {
    "vi": "Bảng bộ nhớ",
    "def": "Vùng đệm ghi dữ liệu trong bộ nhớ RAM của cơ sở dữ liệu dạng LSM-Tree trước khi đẩy xuống ổ đĩa."
  },
  "sstable": {
    "vi": "Bảng chuỗi được sắp xếp",
    "def": "Sorted String Table - Định dạng tệp lưu trữ dữ liệu dạng key-value đã được sắp xếp trên ổ đĩa."
  },
  "sstables": {
    "vi": "Bảng chuỗi được sắp xếp",
    "def": "Sorted String Table - Định dạng tệp lưu trữ dữ liệu dạng key-value đã được sắp xếp trên ổ đĩa."
  },
  "gossip protocol": {
    "vi": "Giao thức đồn thổi",
    "def": "Cơ chế giao tiếp ngang hàng phi tập trung giúp các máy chủ đồng bộ trạng thái và phát hiện lỗi của nhau."
  },
  "eventual consistency": {
    "vi": "Tính nhất quán cuối cùng",
    "def": "Mô hình nhất quán yếu đảm bảo tất cả các bản sao dữ liệu sẽ hội tụ về cùng một giá trị sau một thời gian."
  },
  "strong consistency": {
    "vi": "Tính nhất quán mạnh",
    "def": "Đảm bảo mọi thao tác đọc luôn trả về kết quả của thao tác ghi mới nhất đã thành công."
  },
  "weak consistency": {
    "vi": "Tính nhất quán yếu",
    "def": "Mô hình nhất quán không đảm bảo các thao tác đọc tiếp theo sẽ ngay lập tức thấy giá trị mới nhất."
  },
  "client gateway": {
    "vi": "Cổng kết nối máy khách",
    "def": "Thành phần trung gian tiếp nhận yêu cầu từ client và chuyển tiếp tới dịch vụ phù hợp bên trong."
  },
  "matching engine": {
    "vi": "Bộ khớp lệnh",
    "def": "Thành phần cốt lõi của sàn giao dịch chứng khoán chịu trách nhiệm khớp lệnh mua và bán."
  },
  "order book": {
    "vi": "Sổ lệnh",
    "def": "Danh sách ghi nhận tất cả các lệnh mua và bán đang chờ khớp cho một tài sản tài chính."
  },
  "market data": {
    "vi": "Dữ liệu thị trường",
    "def": "Thông tin về giá cả, khối lượng giao dịch và sổ lệnh được cập nhật theo thời gian thực."
  },
  "payment gateway": {
    "vi": "Cổng thanh toán",
    "def": "Dịch vụ trung gian kết nối ứng dụng với các tổ chức tài chính để thực hiện giao dịch thanh toán."
  },
  "double-entry bookkeeping": {
    "vi": "Kế toán ghi kép",
    "def": "Nguyên tắc kế toán ghi nhận mỗi giao dịch tài chính vào ít nhất hai tài khoản khác nhau (nợ và có) để cân đối."
  },
  "reconciliation": {
    "vi": "Đối soát dữ liệu",
    "def": "Quy trình so sánh các bản ghi tài chính từ các nguồn khác nhau để phát hiện và sửa đổi sai sót."
  },
  "ledger": {
    "vi": "Sổ cái tài chính",
    "def": "Hệ thống ghi chép bất biến lưu trữ toàn bộ lịch sử các giao dịch tài chính để đảm bảo tính minh bạch."
  },
  "psp": {
    "vi": "Nhà cung cấp dịch vụ thanh toán",
    "def": "Payment Service Provider - Tổ chức bên thứ ba hỗ trợ doanh nghiệp chấp nhận thanh toán trực tuyến."
  },
  "sorted set": {
    "vi": "Tập hợp sắp xếp",
    "def": "Cấu trúc dữ liệu lưu trữ các phần tử không trùng lặp kèm theo điểm số để tự động sắp xếp (như trong Redis)."
  },
  "time series database": {
    "vi": "Cơ sở dữ liệu chuỗi thời gian",
    "def": "Hệ thống cơ sở dữ liệu tối ưu hóa cho việc lưu trữ và truy vấn dữ liệu có gắn nhãn thời gian liên tục."
  },
  "tsdb": {
    "vi": "Cơ sở dữ liệu chuỗi thời gian",
    "def": "Time Series Database - Hệ thống tối ưu hóa cho dữ liệu chuỗi thời gian (như Prometheus, InfluxDB)."
  },
  "zero-copy": {
    "vi": "Sao chép không bộ đệm",
    "def": "Kỹ thuật tối ưu hóa CPU bằng cách truyền trực tiếp dữ liệu từ bộ nhớ cache của nhân hệ điều hành sang card mạng."
  },
  "consumer group": {
    "vi": "Nhóm người tiêu dùng",
    "def": "Tập hợp các consumer trong message queue phối hợp chia sẻ việc đọc dữ liệu từ các phân vùng khác nhau."
  },
  "smtp": {
    "vi": "Giao thức truyền thư đơn giản",
    "def": "Simple Mail Transfer Protocol - Giao thức chuẩn được sử dụng để gửi thư điện tử qua mạng."
  },
  "pop3": {
    "vi": "Giao thức bưu điện phiên bản 3",
    "def": "Post Office Protocol version 3 - Giao thức nhận thư bằng cách tải toàn bộ thư về máy khách và xóa trên máy chủ."
  },
  "imap": {
    "vi": "Giao thức truy cập thư điện tử",
    "def": "Internet Message Access Protocol - Giao thức nhận thư cho phép đồng bộ và quản lý thư trực tiếp trên máy chủ."
  },
  "mail store": {
    "vi": "Kho lưu trữ thư điện tử",
    "def": "Hệ thống cơ sở dữ liệu chuyên dụng để lưu giữ và tổ chức dữ liệu email của người dùng."
  },
  "optimistic locking": {
    "vi": "Khóa lạc quan",
    "def": "Cơ chế kiểm soát đồng thời giả định ít xảy ra xung đột bằng cách kiểm tra số phiên bản trước khi ghi dữ liệu."
  },
  "pessimistic locking": {
    "vi": "Khóa bi quan",
    "def": "Cơ chế kiểm soát đồng thời chặn các luồng ghi khác bằng cách khóa bản ghi ngay khi bắt đầu giao dịch."
  },
  "idempotency": {
    "vi": "Tính bất biến giao dịch",
    "def": "Đặc tính đảm bảo một thao tác thực hiện nhiều lần vẫn mang lại kết quả giống như thực hiện một lần duy nhất."
  },
  "fanout on write": {
    "vi": "Phát tán dữ liệu khi ghi",
    "def": "Mô hình tính toán trước bảng tin (feed) của bạn bè ngay khi người dùng đăng bài viết mới."
  },
  "fanout on read": {
    "vi": "Phát tán dữ liệu khi đọc",
    "def": "Mô hình tổng hợp bảng tin động từ bài đăng của bạn bè chỉ khi người dùng tải trang."
  },
  "video streaming": {
    "vi": "Truyền phát video trực tuyến",
    "def": "Kỹ thuật gửi và phát dữ liệu video liên tục qua mạng mà không cần tải toàn bộ tệp về máy trước."
  },
  "transcoder": {
    "vi": "Bộ chuyển mã video",
    "def": "Hệ thống chuyển đổi định dạng và độ phân giải video sang nhiều phiên bản khác nhau để tương thích với các thiết bị."
  },
  "sync conflict": {
    "vi": "Xung đột đồng bộ hóa",
    "def": "Tình huống xảy ra khi cùng một dữ liệu được sửa đổi đồng thời ở hai nơi khác nhau trước khi đồng bộ."
  },
  "block server": {
    "vi": "Máy chủ lưu trữ khối",
    "def": "Thành phần chia nhỏ tệp tin thành các khối dữ liệu nhỏ hơn để tải lên và lưu trữ hiệu quả."
  },
  "trie": {
    "vi": "Cấu trúc dữ liệu Trie",
    "def": "Cây tìm kiếm tiền tố hiệu quả dùng để lưu trữ và gợi ý từ khóa tự động."
  },
  "replication lag": {
    "vi": "Độ trễ nhân bản",
    "def": "Khoảng thời gian chậm trễ để dữ liệu được đồng bộ từ database chính sang các bản sao."
  },
  "host": {
    "vi": "Máy chủ vật lý / Thiết bị đầu cuối",
    "def": "Một máy tính hoặc thiết bị vật lý kết nối vào mạng và cung cấp các dịch vụ hoặc tài nguyên."
  },
  "region": {
    "vi": "Khu vực địa lý (Region)",
    "def": "Vùng địa lý độc lập chứa nhiều trung tâm dữ liệu (như trong kiến trúc AWS, Google Cloud)."
  }
};
