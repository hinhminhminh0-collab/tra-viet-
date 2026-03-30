import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function TeaQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      question: "Bạn thích hương vị nào nhất?",
      options: ["Thanh khiết, nhẹ nhàng", "Đậm đà, chát nhẹ", "Ngọt hậu, thơm hoa", "Trầm mặc, cổ điển"]
    },
    {
      question: "Thời điểm nào bạn thường uống trà?",
      options: ["Sáng sớm tỉnh táo", "Buổi chiều thư giãn", "Tối muộn tĩnh tâm", "Bất cứ lúc nào"]
    },
    {
      question: "Bạn muốn cảm giác gì sau khi uống trà?",
      options: ["Sảng khoái, năng lượng", "Thư thái, giảm stress", "Ấm áp, dễ ngủ", "Trải nghiệm văn hóa"]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateRecommendation(newAnswers);
    }
  };

  const generateRecommendation = async (userAnswers: string[]) => {
    setIsLoading(true);
    try {
      const prompt = `Dựa trên các câu trả lời của người dùng về sở thích trà: ${userAnswers.join(', ')}. Hãy gợi ý một loại trà Việt cụ thể (Bạch trà, Hồng trà, Oolong, Phổ Nhĩ, hoặc Trà thảo mộc) và giải thích lý do tại sao nó phù hợp với họ. Trả lời ngắn gọn, tinh tế, mang phong cách trà đạo.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      setResult(response.text);
    } catch (error) {
      console.error("AI Recommendation error:", error);
      setResult("Có lỗi xảy ra khi gợi ý trà. Hãy thử lại sau nhé!");
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="bg-[#f5f2ed] rounded-3xl p-8 md:p-12 shadow-inner border border-[#1f3d2b]/10">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {!result && !isLoading ? (
          <>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#1f3d2b] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} />
                AI Trà Sư
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1f3d2b]">
                Bạn hợp với loại trà nào?
              </h2>
              <p className="text-gray-600 italic">
                Hãy trả lời vài câu hỏi nhỏ để AI gợi ý hương vị trà dành riêng cho tâm hồn bạn.
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-sm font-bold text-[#1f3d2b]/40 uppercase tracking-widest">
                Câu hỏi {step + 1} / {questions.length}
              </div>
              <h3 className="text-xl font-medium text-[#1f3d2b]">
                {questions[step].question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[step].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="p-4 rounded-xl border border-[#1f3d2b]/20 bg-white text-[#1f3d2b] hover:bg-[#1f3d2b] hover:text-white transition-all duration-300 font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : isLoading ? (
          <div className="py-20 flex flex-col items-center gap-6">
            <RefreshCw className="animate-spin text-[#1f3d2b]" size={48} />
            <p className="text-[#1f3d2b] font-serif italic text-xl">
              Đang pha trà và lắng nghe tâm tư của bạn...
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#1f3d2b]/5 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={80} className="text-[#1f3d2b]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1f3d2b] mb-6 border-b border-[#1f3d2b]/10 pb-4">
                Gợi ý dành cho bạn
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif text-lg italic">
                {result}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 text-[#1f3d2b] font-bold hover:opacity-70 transition-opacity"
              >
                <RefreshCw size={18} />
                Làm lại Quiz
              </button>
              <button className="bg-[#1f3d2b] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                Khám phá ngay <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
