import Quiz from "../components/Quiz/Quiz";
import Passage from "../components/Quiz/Passage";
import { useEffect, useState } from "react";
import { useReading } from "../hooks/useReading.jsx";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

function Reading() {
    console.log("Rendering Reading component");

    const {passage,questions,currentQuestion,setCurrentQuestion,loading} = useReading();
    const [index, setIndex] = useState(0);

    if (loading) {
        return (
            <div className="grid w-full max-w-md items-start gap-4">
                <Alert>
                    <AlertTitle>Vui lòng chờ</AlertTitle>
                    <AlertDescription>
                        Đang tải dữ liệu
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex flex-row h-screen bg-violet-500">
            <div className="basis-1/2 flex justify-center place-self-center">
                <Passage
                    passage={passage}
                    question={currentQuestion}
                    index={index}
                />
            </div>

            <div className="basis-1/2 flex justify-center place-self-center">
                <Quiz
                    passage={passage}
                    questions={questions}
                    question={currentQuestion}
                    setQuestion={setCurrentQuestion}
                    index={index}
                    setIndex={setIndex}
                />
            </div>
        </div>
    );
}

export default Reading;
