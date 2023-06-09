import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    typeform_metadata: defineTable({
      typeformFormId: v.string(),
      convexTableName: v.string(),
      typeformFieldId: v.string(),
      convexFieldName: v.string(),
    }).index("by_typeform_form_id", ["typeformFormId"]),
    dogs: defineTable(v.any()).index("by_user_id", ["user_id"]),
    users: defineTable({
      name: v.string(),
      tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
  },
  { schemaValidation: false }
);
