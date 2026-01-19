import { TimeSlot } from "@/lib/demoData";

interface TimelineVisualizationProps {
  slots: TimeSlot[];
}

export default function TimelineVisualization({ slots }: TimelineVisualizationProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Convert time string "HH:MM" to decimal hours
  const timeToDecimal = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  // Calculate position and width for each slot
  const getSlotStyle = (slot: TimeSlot) => {
    const startDecimal = timeToDecimal(slot.start);
    const endDecimal = timeToDecimal(slot.end);
    const left = (startDecimal / 24) * 100;
    const width = ((endDecimal - startDecimal) / 24) * 100;

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  return (
    <div className="w-full">
      {/* Timeline container */}
      <div className="relative h-16 bg-dark-300 rounded-lg overflow-hidden">
        {/* Hour markers */}
        <div className="absolute inset-0 flex">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex-1 border-r border-dark-400 last:border-r-0"
            >
              <div className="text-[10px] text-dark-500 text-center mt-1">
                {hour.toString().padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots overlay */}
        <div className="absolute inset-0 top-6">
          {slots.map((slot, idx) => {
            const style = getSlotStyle(slot);
            return (
              <div
                key={idx}
                className="absolute h-8 bg-primary-500 rounded shadow-lg transition-all hover:bg-primary-400"
                style={style}
                title={`${slot.start} - ${slot.end}`}
              >
                <div className="flex items-center justify-center h-full text-xs font-medium text-white px-1 truncate">
                  {slot.start} - {slot.end}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {slots.length === 0 && (
        <p className="text-sm text-dark-500 text-center mt-2">
          No time slots added for this day
        </p>
      )}
    </div>
  );
}
