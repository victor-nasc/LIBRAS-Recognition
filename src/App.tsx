import { Github, Circle, Upload as UploadIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "./components/ui/separator";
import { Upload } from "antd";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import VLibras from "@djpfs/react-vlibras";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  const [isShowingWebcam, setIsShowingWebcam] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentSnapshot, setCurrentSnapshot] = useState<string>("");
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [timeUntilNextSnapshot, setTimeUntilNextSnapshot] =
    useState<number>(2.5);
  const [selectedModel, setSelectedModel] = useState<string>("knn");

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
      setCurrentSnapshot("");
    }
  };

  useEffect(() => {
    const sendDataToFlask = async (
      img: string,
      model: string
    ): Promise<void> => {
      console.log("Sending data to Flask", model);
      await fetch("http://localhost:5000/receive_data", {
        method: "POST",
        body: JSON.stringify({ image: img, model: model }),
        headers: {
          "Content-Type": "application/json",
          "Cors-Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          setCurrentText((c) => c + data["interpreted_data"].toUpperCase());
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    if (isShowingWebcam) getVideo();
    else stopVideo();
    if (currentSnapshot) {
      sendDataToFlask(currentSnapshot, selectedModel);
    }
  }, [isShowingWebcam, currentSnapshot, selectedModel]);

  // Atualizar a imagem atual a cada frame da webcam
  useEffect(() => {
    if (!isShowingWebcam) return;
    const interval = setInterval(() => {
      if (webcamRef.current) {
        const canvas = document.createElement("canvas");
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
    }, timeUntilNextSnapshot * 1000);

    return () => clearInterval(interval);
  }, [webcamRef, isShowingWebcam, timeUntilNextSnapshot]);

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

          <a
            href="https://github.com/victor-nasc/LIBRAS-Recognition"
            target="_blank"
          >
            <Button variant="outline">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </a>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed "
              defaultValue="Bem-vindo ao libras.ai! Aqui você pode usar a sua webcam ou enviar uma imagem para que o nosso sistema faça a transcrição de Libras para texto. Essa plataforma foi desenvolvida com o propósito de proporcionar acessibilidade e impulsionar o aprendizado da Linguagem Brasileira de Sinais.
              Ao utilizar a sua webcam, o libras.ai utiliza algoritmos de reconhecimento de gestos para interpretar Libras em tempo real. É possível usar alguns modelos atualmente, mas recomendamos o KNN (Keras Neural Network) para melhores resultados. Além disso, para aqueles que preferem enviar uma imagem, nossa plataforma é também capaz de analisar o sinal representado na imagem estática. Para isso, basta arrastar e soltar a imagem na área indicada abaixo. Confira também o widget de Libras, que pode ser utilizado para traduzir palavras e frases para Libras usando a API do VLibras."
              readOnly
            />

            {/* TODO: Criar aqui scrollable horizontal com conteúdos em Libras */}

            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 flex h-full justify-center items-center">
                <Upload.Dragger
                  multiple={false}
                  listType="picture"
                  showUploadList={{ showRemoveIcon: true }}
                  accept=".png,.jpg,.jpeg"
                  beforeUpload={(file) => {
                    setCurrentText("");
                    setIsShowingWebcam(false);
                    // Convert file to base64
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      setCurrentSnapshot(reader.result as string);
                    };
                    return true;
                  }}
                  className="flex flex-1 rounded-md aspect-video cursor-pointer border-dashed text-md gap-2 items-center justify-center text-muted-foreground"
                >
                  <UploadIcon className="inline mr-2 mb-1" />
                  <span>
                    <p className="text-xl inline">Faça o upload de imagens</p>
                    <p className="text-sm">Formatos aceitos: PNG, JPG e JPEG</p>
                  </span>
                </Upload.Dragger>
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">
                Letras interpretadas:
              </Label>
              <Textarea
                id="transcription_prompt"
                placeholder="As letras interpretadas aparecerão aqui"
                className="resize-none h-5 leading-relaxed"
                value={currentText}
                readOnly
              />
            </div>

            <Button
              type="button"
              className="w-full bg-zinc-200 text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900"
              onClick={() => {
                setCurrentText("");
              }}
            >
              Limpar texto
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <Separator />

          <form className="space-y-6" action="GET">
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select
                defaultValue={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="knn">
                    KNN {"(Keras Neural Network, recomendado)"}
                  </SelectItem>
                  <SelectItem value="logreg">Regressão Logística</SelectItem>
                  <SelectItem value="svm">
                    SVM {"(Support Vector Machine)"}
                  </SelectItem>
                  <SelectItem value="rf">
                    RF {"(Random Forest, não recomendado)"}
                  </SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá alterar o modelo de reconhecimento em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between mb-2">
                <Label>Velocidade de reconhecimento</Label>
                <span className="block text-xs text-muted-foreground italic">
                  {timeUntilNextSnapshot}s
                </span>
              </div>
              <Slider
                min={0.1}
                max={5}
                step={0.1}
                value={[timeUntilNextSnapshot]}
                onValueChange={(value) => setTimeUntilNextSnapshot(value[0])}
              />

              <span className="block text-xs text-muted-foreground italic">
                Velocidade {"(em segundos)"} com que as capturas são enviadas
                para reconhecimento
              </span>
            </div>

            <Separator />

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
