// AI Service cho LearningRadar Tutor

/**
 * Hàm gọi AI Tutor giải thích khái niệm & tự động sinh câu hỏi kiểm tra hiểu thật (Understanding Check)
 */
export async function askAiTutor({ selectedText, userQuestion, contextSlide }) {
  // Trọng tâm hackathon: Bắt buộc có AI chạy thật hoặc mock AI linh hoạt
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

  if (apiKey) {
    try {
      // Ví dụ gọi Gemini / OpenAI API nếu thành viên nhóm cấu hình API Key
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Bạn là AI Tutor của VLearn.
Đoạn slide sinh viên chọn: "${selectedText}"
Câu hỏi sinh viên: "${userQuestion}"
Nội dung slide: "${contextSlide}"

Nhiệm vụ:
1. Giải thích câu hỏi một cách ngắn gọn, súc tích (dưới 150 từ). Trích dẫn đoạn tài liệu nếu có.
2. Đưa ra MỘT CÂU HỎI KIỂM TRA HIỂU THẬT (Check Question) dạng trắc nghiệm (A, B, C, D) kèm đáp án đúng để xác minh sinh viên đã hiểu đúng khái niệm hay chưa.`
            }]
          }]
        })
      });
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return {
          answer: rawText,
          isRealAi: true
        };
      }
    } catch (err) {
      console.warn("Lỗi gọi AI API thật, fallback về Mock AI:", err);
    }
  }

  // Fallback Mock AI Response nếu chưa có API Key
  await new Promise(res => setTimeout(res, 800)); // Giả lập độ trễ AI 800ms
  return {
    answer: `Chào bạn! Về thắc mắc "${userQuestion}" dựa trên đoạn slide "${selectedText?.substring(0, 40)}...":

- **Giải thích:** ${selectedText ? 'Kỹ thuật này được thiết kế để giải quyết bài toán mượt hoá mô hình và hạn chế bám quá chặt vào tập dữ liệu train.' : 'Đây là khái niệm cốt lõi giúp tối ưu hoá quá trình huấn luyện AI.'}
- **Điểm cần lưu ý:** Cần phân biệt rõ trạng thái mô hình lúc Huấn luyện (Train) và lúc Dự đoán (Inference).`,
    checkQuestion: {
      question: `Lát cắt kiểm tra: Khái niệm "${selectedText?.substring(0, 25) || 'này'}" có tác dụng chính gì khi kiểm thử thực tế?`,
      options: [
        'A. Giúp giữ nguyên hiệu năng và tính toán chính xác trên tập Test',
        'B. Tăng thêm nhiễu (noise) vào kết quả dự đoán',
        'C. Bật tất cả các cổng thần kinh để thu được độ chính xác cao nhất',
        'D. Cả A và C đều đúng'
      ],
      correctAnswer: 'D'
    },
    isRealAi: false
  };
}
