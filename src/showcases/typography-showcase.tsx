import { Typography } from '@/components/typography';

function TypographyShowcase() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Headers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Headings</h2>

        <div className="space-y-3">
          <Typography variant="h1">
            Heading 1 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="h2">
            Heading 2 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="h3">
            Heading 3 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="h4">
            Heading 4 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="h5">
            Heading 5 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="h6">
            Heading 6 - The quick brown fox jumps over the lazy dog.
          </Typography>
        </div>
      </section>

      {/* Subtitles */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Subtitles</h2>

        <div className="space-y-3">
          <Typography variant="subtitle-1">
            Subtitle 1 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="subtitle-2">
            Subtitle 2 - The quick brown fox jumps over the lazy dog.
          </Typography>
        </div>
      </section>

      {/* Body Text */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Body Text</h2>

        <div className="space-y-3">
          <Typography variant="body-1">
            Body 1 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="body-2">
            Body 2 - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="paragraph">
            Paragraph - The quick brown fox jumps over the lazy dog.
          </Typography>
        </div>
      </section>

      {/* Other Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Other Variants</h2>

        <div className="space-y-3">
          <Typography variant="button">
            Button Text - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="caption">
            Caption - The quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="overline">
            Overline - The quick brown fox jumps over the lazy dog.
          </Typography>
        </div>
      </section>

      {/* Dark Mode Toggle Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Responsive Example</h2>
        <div className="p-6 border rounded-lg">
          <Typography variant="h2" className="mb-4">
            This typography scales responsively
          </Typography>
          <Typography variant="paragraph">
            Resize your browser window to see how the typography adapts to
            different screen sizes. On mobile devices, all text sizes are
            optimized for better readability.
          </Typography>
        </div>
      </section>
    </div>
  );
}

export default TypographyShowcase;
