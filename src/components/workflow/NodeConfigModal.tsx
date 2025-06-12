import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type WorkflowNode, type WorkflowNodeData } from '@/types/workflow';

interface NodeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: WorkflowNode | null;
  onSave: (nodeId: string, data: Partial<WorkflowNodeData>) => void; // Modified onSave signature
}

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  isOpen,
  onClose,
  node,
  onSave,
}) => {
  const [label, setLabel] = useState('');
  const [initialLabel, setInitialLabel] = useState('');
  const [configValue, setConfigValue] = useState('');
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    if (node) {
      setLabel(node.data.label);
      setInitialLabel(node.data.label); // Store initial label
      setConfigValue(node.data.configValue || '');
      setTextValue(node.data.textValue || '');
    } else {
      // Reset states if node becomes null (e.g., modal closes and reopens quickly)
      setLabel('');
      setInitialLabel('');
      setConfigValue('');
      setTextValue('');
    }
  }, [node]);

  const handleSave = () => {
    if (node) {
      const updatedData: Partial<WorkflowNodeData> = { label };
      // Only include configValue or textValue if they are relevant for the node type
      if (node.type === 'textInput') {
        updatedData.textValue = textValue;
      } else if (node.type === 'uppercaseText' || node.type === 'generic') {
        updatedData.configValue = configValue;
      }
      // No need to add configValue/textValue if the node type doesn't use them

      onSave(node.id, updatedData);
      onClose();
    }
  };

  if (!node) {
    return null;
  }

  const hasSpecificConfigFields =
    node.type === 'textInput' || node.type === 'uppercaseText' || node.type === 'generic';
  const isLabelChanged = label !== initialLabel;

  // Determine if any specific config field has changed (if applicable)
  let specificConfigChanged = false;
  if (node.type === 'textInput') {
    specificConfigChanged = textValue !== (node.data.textValue || '');
  } else if (node.type === 'uppercaseText' || node.type === 'generic') {
    specificConfigChanged = configValue !== (node.data.configValue || '');
  }

  const canSaveChanges = isLabelChanged || (hasSpecificConfigFields && specificConfigChanged);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Node: {node.data.name || 'Unnamed Node'}</DialogTitle>{' '}
          {/* Use node.data.name for title */}
          <DialogDescription>
            Edit the details for this node. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="node-label" className="text-right">
              Node Label
            </Label>
            <Input
              id="node-label"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="col-span-3"
              placeholder="Enter node label..."
            />
          </div>
          {node.type === 'textInput' ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text-value" className="text-right">
                Text Value
              </Label>
              <Textarea
                id="text-value"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                className="col-span-3"
                placeholder="Enter text here..."
              />
            </div>
          ) : node.type === 'uppercaseText' || node.type === 'generic' ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="config-value" className="text-right">
                Configuration Value
              </Label>
              <Input
                id="config-value"
                value={configValue}
                onChange={e => setConfigValue(e.target.value)}
                className="col-span-3"
                placeholder="Enter configuration value..."
              />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground col-span-4 py-2 px-1">
              This node type does not require additional configuration.
            </div>
          )}

          {node.data.status === 'completed' &&
            node.data.actualOutput !== undefined &&
            node.data.actualOutput !== null && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Node Output</h4>
                  <ScrollArea className="h-32 w-full rounded-md border p-2">
                    <pre className="text-sm">
                      <code>{JSON.stringify(node.data.actualOutput, null, 2)}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
