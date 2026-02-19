import React from "react";
import { motion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import { Mail, Link2, Instagram, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const FORMSPREE_FORM_ID = "maqdbabk";

export default function Contact() {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-48 px-6 container mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Get in touch
          </span>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-6">
            Contact
            <br />
            <span className="italic opacity-30">Wyldstone.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed mb-16 max-w-xl">
            Questions about our bracelets, impact, or wholesale? We’d love to hear from you.
          </p>

          <div className="grid md:grid-cols-5 gap-12">
            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="md:col-span-3"
            >
              {state.succeeded ? (
                <div
                  className="rounded-2xl border border-border bg-muted/30 p-8 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-lg font-medium text-foreground mb-2">Message sent.</p>
                  <p className="text-sm text-muted-foreground">
                    We’ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {state.errors && state.errors.getFormErrors().length > 0 && (
                    <div
                      className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                      role="alert"
                    >
                      {state.errors.getFormErrors().map((err) => (
                        <p key={err.message}>{err.message}</p>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-xs font-black uppercase tracking-wider">
                      Name
                    </Label>
                    <Input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                      className="rounded-lg border-border"
                      aria-label="Your name"
                      disabled={state.submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-xs font-black uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="rounded-lg border-border"
                      aria-label="Your email"
                      disabled={state.submitting}
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-sm text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message" className="text-xs font-black uppercase tracking-wider">
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      placeholder="How can we help?"
                      required
                      rows={5}
                      className="rounded-lg border-border resize-none"
                      aria-label="Your message"
                      disabled={state.submitting}
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-sm text-destructive" />
                  </div>
                  <Button
                    type="submit"
                    disabled={state.submitting}
                    className="rounded-full font-black uppercase tracking-wider gap-2"
                    aria-label="Send message"
                  >
                    {state.submitting ? "Sending…" : "Send message"}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 space-y-8"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground block mb-3">
                  Email
                </span>
                <a
                  href="mailto:wyldstoneja@gmail.com"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  aria-label="Email us at wyldstoneja@gmail.com"
                >
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>wyldstoneja@gmail.com</span>
                </a>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground block mb-3">
                  Links
                </span>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://linktr.ee/wyldstoneja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                    aria-label="Open our Linktree in a new tab"
                  >
                    <Link2 className="h-5 w-5 shrink-0" />
                    <span>Linktree link</span>
                  </a>
                  <a
                    href="https://instagram.com/wyldstoneja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                    aria-label="Open our Instagram in a new tab"
                  >
                    <Instagram className="h-5 w-5 shrink-0" />
                    <span>Instagram link</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
