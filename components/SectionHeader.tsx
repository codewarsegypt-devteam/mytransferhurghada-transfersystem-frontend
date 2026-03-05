interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeader({
  subtitle,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`.trim()}>
      {subtitle && (
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-[#C9A14A]" />
          <p className="text-[#C9A14A] font-semibold text-xs uppercase tracking-[0.18em]">
            {subtitle}
          </p>
          <span className="w-8 h-px bg-[#C9A14A]" />
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg mt-4 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
