import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AuthField {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  link?: {
    href: string;
    text: string;
  };
}

interface AuthCardProps extends React.ComponentProps<"div"> {
  title: string;
  description: string;
  fields?: AuthField[];
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
  googleLabel?: string;
  footer?: React.ReactNode;
  error?: string | null;
  children?: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  fields,
  onSubmit,
  submitLabel,
  googleLabel,
  footer,
  error,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {fields ? (
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                {fields.map((field) => (
                  <div key={field.id} className="grid gap-3">
                    {field.link ? (
                      <div className="flex items-center">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <a
                          href={field.link.href}
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          {field.link.text}
                        </a>
                      </div>
                    ) : (
                      <Label htmlFor={field.id}>{field.label}</Label>
                    )}
                    <Input
                      id={field.id}
                      name={field.name || field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                ))}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {(submitLabel || googleLabel) && (
                  <div className="flex flex-col gap-3">
                    {submitLabel && (
                      <Button type="submit" className="w-full">
                        {submitLabel}
                      </Button>
                    )}
                    {googleLabel && (
                      <Button variant="outline" className="w-full">
                        {googleLabel}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {footer}
            </form>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </div>
  );
}

