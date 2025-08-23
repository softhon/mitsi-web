import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/typography';
import { useToast } from '@/packages/toast';
import type { ToastPosition } from '@/packages/toast';
import { useToastActions } from '../packages/toast/toast-hooks';

const ToastShowcase: React.FC = () => {
  const { position, setPosition } = useToast();
  const { toast, success, error, warning, info } = useToastActions();

  const positions: { value: ToastPosition; label: string }[] = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  const showCameraPermissionToast = () => {
    error(
      'Camera/Mic permissions denied',
      'You may have previously denied access to camera/mic',
      {
        action: {
          label: 'Learn more',
          onClick: () => console.log('Learn more clicked'),
        },
      }
    );
  };

  const showVariousToasts = () => {
    toast('Default Toast', 'This is a default notification');

    setTimeout(() => {
      success('Success!', 'Your action was completed successfully');
    }, 500);

    setTimeout(() => {
      warning('Warning', 'This action may have consequences');
    }, 1000);

    setTimeout(() => {
      info('Information', "Here's some helpful information");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div>
        <Typography variant="h1" className="mb-4">
          Toast Components
        </Typography>
        <Typography variant="body-1" className="text-muted-foreground">
          Customizable toast notifications with positioning and type-based
          styling.
        </Typography>
      </div>

      {/* Position Controls */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Typography variant="h2">Position</Typography>
          <Badge variant="outline">{position}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {positions.map(({ value, label }) => (
            <Button
              key={value}
              variant={position === value ? 'default' : 'outline'}
              onClick={() => setPosition(value)}
              size="sm"
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      {/* Toast Type Examples */}
      <section className="space-y-6">
        <Typography variant="h2">Toast Types</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() =>
              toast('Default Toast', 'This is a basic notification')
            }
            className="h-auto p-4 flex-col items-start text-left border-l-4 border-l-gray-400"
          >
            <div className="font-semibold mb-1">Default</div>
            <div className="text-sm text-muted-foreground">
              Basic notification
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              success('Success!', 'Operation completed successfully')
            }
            className="h-auto p-4 flex-col items-start text-left border-l-4 border-l-green-500"
          >
            <div className="font-semibold mb-1">Success</div>
            <div className="text-sm text-muted-foreground">
              Positive feedback
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => error('Error!', 'Something went wrong')}
            className="h-auto p-4 flex-col items-start text-left border-l-4 border-l-red-500"
          >
            <div className="font-semibold mb-1">Error</div>
            <div className="text-sm text-muted-foreground">Error messages</div>
          </Button>

          <Button
            variant="outline"
            onClick={() => warning('Warning!', 'Please be careful')}
            className="h-auto p-4 flex-col items-start text-left border-l-4 border-l-yellow-500"
          >
            <div className="font-semibold mb-1">Warning</div>
            <div className="text-sm text-muted-foreground">Caution alerts</div>
          </Button>

          <Button
            variant="outline"
            onClick={() => info('Info', "Here's some useful information")}
            className="h-auto p-4 flex-col items-start text-left border-l-4 border-l-blue-500"
          >
            <div className="font-semibold mb-1">Info</div>
            <div className="text-sm text-muted-foreground">Informational</div>
          </Button>
        </div>
      </section>

      {/* Example from Image */}
      <section className="space-y-6">
        <Typography variant="h2">Camera Permission Example</Typography>

        <div className="flex gap-4">
          <Button onClick={showCameraPermissionToast}>
            Show Camera Permission Toast
          </Button>
        </div>
      </section>

      {/* Advanced Examples */}
      <section className="space-y-6">
        <Typography variant="h2">Advanced Examples</Typography>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                success('File uploaded', 'Your document has been saved', {
                  action: {
                    label: 'View file',
                    onClick: () => console.log('View file clicked'),
                  },
                })
              }
            >
              Toast with Action
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                error('Connection lost', 'Check your internet connection', {
                  duration: 0, // Persistent
                })
              }
            >
              Persistent Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                info('Quick tip', 'This will disappear in 2 seconds', {
                  duration: 2000,
                })
              }
            >
              Short Duration
            </Button>

            <Button variant="secondary" onClick={showVariousToasts}>
              Multiple Toasts
            </Button>
          </div>
        </div>
      </section>

      {/* Real-world Scenarios */}
      <section className="space-y-6">
        <Typography variant="h2">Real-world Scenarios</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg space-y-3">
            <Typography variant="subtitle-1">Form Validation</Typography>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  error(
                    'Validation Error',
                    'Please fill in all required fields'
                  )
                }
              >
                Show Validation Error
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  success('Form Submitted', 'Your information has been saved')
                }
              >
                Show Success Message
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <Typography variant="subtitle-1">System Updates</Typography>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  info('System Update', 'A new version is available', {
                    action: {
                      label: 'Update now',
                      onClick: () => console.log('Update clicked'),
                    },
                  })
                }
              >
                Update Available
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  warning(
                    'Maintenance',
                    'System will be down for maintenance at 2 AM'
                  )
                }
              >
                Maintenance Alert
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <Typography variant="h2">Usage Instructions</Typography>

        <div className="p-4 bg-muted/50 rounded-lg">
          {/* <Typography variant="body-2" className="space-y-2 font-mono text-sm">
            <div>// Basic usage</div>
            <div>const {'{ toast, success, error, warning, info }'} = useToastActions();</div>
            <br />
            <div>// Show different types</div>
            <div>success('Title', 'Description');</div>
            <div>error('Error', 'Something went wrong');</div>
            <br />
            <div>// With action button</div>
            <div>info('Title', 'Description', {'{'}action: {'{'}label: 'Action', onClick: () => {'{}'}{'}'}{'}'});</div>
            <br />
            <div>// Control duration (0 = persistent)</div>
            <div>warning('Title', 'Description', {'{'}duration: 3000{'}'});</div>
          </Typography> */}
        </div>
      </section>
    </div>
  );
};

export default ToastShowcase;
