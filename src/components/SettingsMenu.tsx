import { Badge } from '@/untitled_ui/base/badges/badges';
import { Button } from '@/untitled_ui/base/buttons/button';

import { useEffect, useRef, useState } from 'react';

import {
  Beaker,
  Check,
  Monitor,
  Settings,
  Smartphone,
  Tablet,
} from 'lucide-react';

import { breakpointPresets } from '../config/breakpointPresets';

interface SettingsMenuProps {
  currentPreset: string;
  onPresetChange: (presetId: string) => void;
}

export const SettingsMenu = ({
  currentPreset,
  onPresetChange,
}: SettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPresetIcon = (presetId: string) => {
    switch (presetId) {
      case 'mobile-first':
        return <Smartphone className="w-4 h-4" />;
      case 'compact':
        return <Tablet className="w-4 h-4" />;
      case 'wide':
        return <Monitor className="w-4 h-4" />;
      case 'experimental':
        return <Beaker className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        color="tertiary"
        size="sm"
        className="p-2"
        iconLeading={Settings}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Breakpoint Presets
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Choose different responsive breakpoint configurations
            </p>
          </div>

          <div className="p-2 max-h-96 overflow-y-auto">
            {breakpointPresets.map((preset) => (
              <button
                key={preset.id}
                className={`w-full p-3 text-left rounded-md transition-colors hover:bg-gray-50 ${
                  currentPreset === preset.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  onPresetChange(preset.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {getPresetIcon(preset.id)}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {preset.name}
                          </span>
                          {currentPreset === preset.id && (
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 断点信息 */}
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <Badge type="pill-color" color="gray" size="sm">
                        LG: {preset.breakpoints.lg}px
                      </Badge>
                      <Badge type="pill-color" color="gray" size="sm">
                        {preset.cols.lg}col
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge type="pill-color" color="gray" size="sm">
                        MD: {preset.breakpoints.md}px
                      </Badge>
                      <Badge type="pill-color" color="gray" size="sm">
                        {preset.cols.md}col
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge type="pill-color" color="gray" size="sm">
                        SM: {preset.breakpoints.sm}px
                      </Badge>
                      <Badge type="pill-color" color="gray" size="sm">
                        {preset.cols.sm}col
                      </Badge>
                    </div>
                  </div>

                  {/* 容器配置信息 */}
                  {preset.containerConfig && (
                    <div className="flex flex-wrap gap-2">
                      {preset.containerConfig.minWidth && (
                        <Badge type="pill-color" color="success" size="sm">
                          Min: {preset.containerConfig.minWidth}px
                        </Badge>
                      )}
                      {preset.containerConfig.maxWidth && (
                        <Badge type="pill-color" color="warning" size="sm">
                          Max: {preset.containerConfig.maxWidth}px
                        </Badge>
                      )}
                      {preset.containerConfig.adaptive && (
                        <Badge type="pill-color" color="brand" size="sm">
                          Adaptive Width
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-600">
              💡 Tip: Changing breakpoint configuration will reset the current
              layout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
