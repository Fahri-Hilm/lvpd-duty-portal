import { motion } from 'motion/react';

type ChapterHeadingProps = {
  readonly number: string;
  readonly overline: string;
  readonly title: string;
  readonly description: string;
};

export function ChapterHeading({ number, overline, title, description }: ChapterHeadingProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8 grid gap-4 border-t border-slate-800 pt-5 md:grid-cols-[5rem_minmax(0,1fr)_minmax(14rem,22rem)] md:items-end"
    >
      <span className="font-display text-4xl font-bold tabular-nums text-slate-700" aria-hidden="true">{number}</span>
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-400">{overline}</p>
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-slate-100 md:text-5xl">{title}</h2>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-slate-500 md:justify-self-end">{description}</p>
    </motion.header>
  );
}
