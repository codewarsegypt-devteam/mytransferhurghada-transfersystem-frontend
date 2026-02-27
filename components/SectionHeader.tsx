interface SectionHeaderProps {
  /** Small label above the title (handwriting style, accent color) */
  subtitle: string;
  /** Main section heading */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Optional extra class for the wrapper */
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
      <p className="text-secondary font-medium text-lg mb-3 handwriting-style">
        {subtitle}
      </p>
      <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#2C3539] mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
