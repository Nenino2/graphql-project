import { registerEnumType } from "type-graphql";

export enum MutationType {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted"
}

registerEnumType(MutationType, { name: "MutationType"});