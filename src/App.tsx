import { Github, Circle, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "./components/ui/separator";
import { Upload } from "antd";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import VLibras from "@djpfs/react-vlibras";
import { useState, useRef, useEffect } from "react";

export function App() {
  const [isShowingWebcam, setIsShowingWebcam] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentSnapshot, setCurrentSnapshot] = useState<string>("");
  const webcamRef = useRef<HTMLVideoElement>(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: false,
      })
      .then((stream) => {
        const video = document.querySelector("video");
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const stopVideo = () => {
    const video = document.querySelector("video");
    if (video) {
      video.srcObject = null;
      setCurrentText("");
      setCurrentSnapshot("");
    }
  };

  const sendDataToFlask = async (data: string): Promise<void> => {
    await fetch("http://localhost:5000/receive_data", {
      method: "POST",
      body: JSON.stringify({ data: data }),
      headers: {
        "Content-Type": "application/json",
        "Cors-Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        setCurrentText(currentText + data["interpreted_data"].toUpperCase());
        if (currentText.length > 10) setCurrentText("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (isShowingWebcam) {
      getVideo();
      if (currentSnapshot) {
        sendDataToFlask(currentSnapshot);
      }
    } else {
      stopVideo();
    }
  }, [isShowingWebcam, currentSnapshot]);

  // Atualizar a imagem atual a cada frame da webcam
  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current) {
        const canvas = document.createElement("canvas");
        // Canvas deve ser sr-only
        canvas.style.display = "none";
        canvas.width = webcamRef.current.videoWidth;
        canvas.height = webcamRef.current.videoHeight;

        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(
            webcamRef.current,
            0,
            0,
            webcamRef.current.videoWidth,
            webcamRef.current.videoHeight
          );

          const data = canvas.toDataURL();
          setCurrentSnapshot(data);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [webcamRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <VLibras forceOnload={true} />
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">libras.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💜 no Brasil 🇧🇷
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              defaultValue="Bem-vindo ao libras.ai! Aqui você pode usar a sua webcam ou enviar uma imagem para que o nosso sistema faça a transcrição de Libras para texto. Aproveite para conferir também mais conteúdos voltados ao aprendizado de libras nos seguintes sites:"
              readOnly
            />

            {/* TODO: Criar aqui scrollable horizontal com conteúdos em Libras */}

            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 flex h-full justify-center items-center">
                <Upload className="border flex flex-1 rounded-md aspect-video cursor-pointer border-dashed text-md gap-2 items-center justify-center text-muted-foreground">
                  <UploadIcon className="inline mr-2" />
                  <p className="text-xl inline">Faça o upload de imagens</p>
                </Upload>
              </div>
              <div className="flex-1 flex h-full justify-center items-center">
                <video
                  className="border flex flex-1 rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground"
                  ref={webcamRef}
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: o projeto continua sob desenvolvimento, e no momento
            permite a transcrição de letras isoladas em Libras.
          </p>
        </div>

        {/* Side bar */}
        <aside className="w-80 space-y-6">
          {/* TODO: transformar esse formulário de vídeo num contêiner que mostre a webcam em tempo real (aspect-video é importante) */}
          <form className="space-y-6 flex flex-col items-center">
            {/* TODO: Centralizar isso */}
            <div className="w-1/2 flex justify-between items-center">
              <Label htmlFor="transcription_prompt">
                Letras interpretadas:
              </Label>
              <span className="text-2xl text-green-500">{currentText}</span>
            </div>

            <Button
              type="submit"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                setIsShowingWebcam(!isShowingWebcam);
              }}
            >
              {isShowingWebcam ? "Parar gravação" : "Iniciar gravação"}
              <Circle className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
