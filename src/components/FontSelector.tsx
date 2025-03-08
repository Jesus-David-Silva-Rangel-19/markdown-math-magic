
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Font, fontDisplayNames } from '@/utils/markdownUtils';

interface FontSelectorProps {
  label: string;
  value: Font;
  onChange: (value: Font) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{label}:</span>
      <Select value={value} onValueChange={(val) => onChange(val as Font)}>
        <SelectTrigger className="w-[180px] h-9 px-3">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(fontDisplayNames) as Font[]).map((font) => (
            <SelectItem 
              key={font} 
              value={font} 
              className={`font-${font}`}
            >
              {fontDisplayNames[font]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontSelector;
