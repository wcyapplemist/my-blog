import BookNotesGallery from "@/components/BookNotesGallery";

export default function ReadingNotes() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex w-full max-w-2xl flex-col px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Reading Notes
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Click on a book to see my notes.
        </p>
        <div className="mt-8">
          <BookNotesGallery />
        </div>
      </main>
    </div>
  );
}
