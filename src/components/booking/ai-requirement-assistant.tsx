"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { ParsedRequirement } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface AIRequirementAssistantProps {
  onParsed: (parsed: ParsedRequirement) => void;
  initialValue?: string;
  onChange?: (value: string) => void;
}

export function AIRequirementAssistant({
  onParsed,
  initialValue = "",
  onChange,
}: AIRequirementAssistantProps) {
  const [text, setText] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedRequirement | null>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/parse-requirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setParsed(data);
      onParsed(data);
      onChange?.(text);
    } catch {
      // fallback handled by API
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-base font-medium mb-2 block">
          Tell us what you need
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          Describe your requirement in your own words. Our AI will help extract the details.
        </p>
        <Textarea
          placeholder='e.g. "My father is 78 and needs someone to accompany him to the hospital tomorrow from 10 AM to 3 PM."'
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onChange?.(e.target.value);
          }}
          className="min-h-[120px] text-base resize-none"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleParse}
        disabled={!text.trim() || loading}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
        {loading ? "Analyzing..." : "Analyze with AI"}
      </Button>

      {parsed && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI extracted details
            </p>
            <div className="flex flex-wrap gap-2">
              {parsed.careType && (
                <Badge variant="secondary">
                  {parsed.careType.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              )}
              {parsed.date && <Badge variant="secondary">Date: {parsed.date}</Badge>}
              {parsed.time && <Badge variant="secondary">Time: {parsed.time}</Badge>}
              {parsed.duration && <Badge variant="secondary">{parsed.duration} hours</Badge>}
              {parsed.patientAge && <Badge variant="secondary">Patient age: {parsed.patientAge}</Badge>}
              {parsed.isOvernight && <Badge variant="secondary">Overnight care</Badge>}
              {parsed.requiredLanguages.map((l) => (
                <Badge key={l} variant="outline">{l}</Badge>
              ))}
              {parsed.requiredSkills.map((s) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
