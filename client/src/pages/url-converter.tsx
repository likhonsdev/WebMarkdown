import { Header } from "@/components/layout/header";
import { UrlConverterCard } from "@/components/dashboard/url-converter-card";

export default function UrlConverter() {
  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="URL Converter"
        description="Convert web pages to markdown format"
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <UrlConverterCard />
        </div>
      </main>
    </div>
  );
}
