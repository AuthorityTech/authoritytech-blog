import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight font-serif text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-sm font-ui text-muted-foreground text-pretty">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <p className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-ui text-foreground transition-opacity duration-150 ease-out hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-border focus:ring-offset-0 rounded-md"
          >
            ← Back to blog
          </Link>
        </p>
      </main>
    </div>
  );
}
