import { router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { authRouter } from "./routers/auth";
import { contactRouter } from "./routers/contact";
import { profileRouter } from "./routers/profile";
import { analyticsRouter } from "./routers/analytics";
import { businessHoursRouter } from "./routers/businessHours";
import { brochureRouter } from "./routers/brochure";
import { chatbotRouter } from "./routers/chatbot";
import { adminRouter } from "./routers/admin";
import { auditRouter } from "./routers/audit";
import { availabilityRouter } from "./routers/availability";
import { blogRouter } from "./routers/blog";
import { indexnowRouter } from "./routers/indexnow";
import { adminMediaRouter } from "./routers/adminMedia";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  contact: contactRouter,
  profile: profileRouter,
  analytics: analyticsRouter,
  businessHours: businessHoursRouter,
  brochure: brochureRouter,
  chatbot: chatbotRouter,
  admin: adminRouter,
  audit: auditRouter,
  availability: availabilityRouter,
  blog: blogRouter,
  indexnow: indexnowRouter,
  media: adminMediaRouter,
});

export type AppRouter = typeof appRouter;
