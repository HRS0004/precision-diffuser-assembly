import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

type CameraView = 'top' | 'side' | 'isometric';

interface ViewControlsProps {
  view: CameraView;
  onViewChange: (view: CameraView) => void;
  bladeCount: number;
  onBladeCountChange: (count: number) => void;
}

export const ViewControls = ({
  view,
  onViewChange,
  bladeCount,
  onBladeCountChange,
}: ViewControlsProps) => {
  return (
    <Card className="absolute top-4 left-4 z-10 p-4 bg-card/95 backdrop-blur-sm border-border shadow-lg">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground">Camera View</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={view === 'top' ? 'default' : 'outline'}
              onClick={() => onViewChange('top')}
              className="text-xs"
            >
              Top
            </Button>
            <Button
              size="sm"
              variant={view === 'side' ? 'default' : 'outline'}
              onClick={() => onViewChange('side')}
              className="text-xs"
            >
              Side
            </Button>
            <Button
              size="sm"
              variant={view === 'isometric' ? 'default' : 'outline'}
              onClick={() => onViewChange('isometric')}
              className="text-xs"
            >
              Isometric
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Blade Count: {bladeCount}
          </Label>
          <Slider
            value={[bladeCount]}
            onValueChange={(values) => onBladeCountChange(values[0])}
            min={20}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          <p className="font-medium mb-1">Controls:</p>
          <p>• Left click + drag to rotate</p>
          <p>• Scroll to zoom</p>
          <p>• Right click + drag to pan</p>
        </div>
      </div>
    </Card>
  );
};
