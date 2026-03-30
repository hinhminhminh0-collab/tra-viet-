import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../../lib/utils';

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
    <div className="relative overflow-hidden bg-tea-dark rounded-[40px] p-8 md:p-16 shadow-2xl">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-tea-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-12">
        <AnimatePresence mode="wait">
          {!result && !isLoading ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                  <Sparkles size={14} className="text-tea-accent" />
                  AI Trà Sư
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                  Tìm phẩm trà <br /> dành riêng cho bạn
                </h2>
                <p className="text-white/60 italic text-lg">
                  Lắng nghe tâm tư, khơi nguồn cảm hứng qua từng chén trà.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-center gap-2">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        i === step ? "w-12 bg-white" : "w-4 bg-white/20"
                      )} 
                    />
                  ))}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl font-serif text-white/90">
                    {questions[step].question}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[step].options.map((option, i) => (
                      <motion.button
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleAnswer(option)}
                        className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white hover:text-tea-dark transition-all duration-500 text-left overflow-hidden"
                      >
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-tea-dark/20">
                            <Check size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 flex flex-col items-center gap-8"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-white text-2xl font-serif italic">Đang pha trà...</p>
                <p className="text-white/40 text-sm uppercase tracking-widest font-bold">AI đang lắng nghe tâm tư của bạn</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[40px] border border-white/10 text-left relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles size={120} className="text-white" />
                </div>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Lời nhắn từ AI Trà Sư</h3>
                      <p className="text-xl font-serif font-bold text-white">Gợi ý dành riêng cho bạn</p>
                    </div>
                  </div>
                  
                  <div className="text-white/90 leading-relaxed whitespace-pre-wrap font-serif text-xl md:text-2xl italic border-l-2 border-white/20 pl-8 py-2">
                    {result}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-2 text-white/60 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                >
                  <RefreshCw size={16} />
                  Làm lại Quiz
                </button>
                <button className="bg-white text-tea-dark px-12 py-5 rounded-full font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-tea-bg transition-all shadow-2xl shadow-white/10">
                  Khám phá ngay <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
