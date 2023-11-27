import { Github, Circle, FileVideo, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "./components/ui/separator";
import { Upload } from "antd";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import VLibras from "@djpfs/react-vlibras";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <VLibras forceOnload={true} />
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">libras.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💜 no 🇧🇷
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
              placeholder="Introduza o texto para gerar o vídeo em Libras"
            />

            {/* TODO: Contênier com interação de imagem do usuário */}
            <div className="flex items-center justify-between gap-2">
              <div className="bg-slate-600 flex-1">
                <Upload>
                  <Button variant="outline" className="border-dashed">
                    <UploadIcon />
                    Faça o Upload de imagens
                  </Button>
                </Upload>
              </div>
              <div className="bg-slate-800 flex-1">
                Vídeo gerado pela API VLibras com base no texto introduzido na
                textarea
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
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground"
            >
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo para gerar sua transcrição
            </label>

            <input
              type="file"
              id="video"
              accept="video/mp4"
              className="sr-only"
            />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Texto transcrito</Label>
              <Textarea
                id="transcription_prompt"
                className="resize-none h-5 leading-relaxed"
                placeholder="Seu texto gerado aparecerá aqui..."
                readOnly
              />
            </div>

            <Button type="submit" className="w-full">
              Iniciar gravação
              <Circle className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* <Separator />

          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Modelo</Label>
            </div>
          </form> */}
        </aside>
      </main>
    </div>
  );
}
