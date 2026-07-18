/** Data-model types. See docs/reference/data-model.md for the schema contract. */

export type CampaignType = "Newsletter" | "Promotion" | "Lifecycle" | "Announcement";

export type ListName = "Main newsletter" | "VIP customers" | "Legacy blog signups";

/** One email send (campaign). All figures are totals for that send. */
export interface CampaignSend {
  id: string;
  /** Internal campaign name, e.g. "2025-09 The Steep #42". */
  name: string;
  /** Subject line as recipients saw it. */
  subject: string;
  /** ISO date the send went out. */
  sentDate: string;
  type: CampaignType;
  list: ListName;
  /** Emails sent = delivered + bounces. */
  sent: number;
  delivered: number;
  bounces: number;
  /** Unique opens. Directional only (privacy proxies inflate opens). */
  opens: number;
  /** Unique link clicks. */
  clicks: number;
  unsubscribes: number;
  /** Spam complaints. */
  complaints: number;
  /** Revenue attributed to the send (last-click, demo convention), USD. */
  revenue: number;
}

/** One month of list movement for one mailing list. */
export interface ListMonth {
  /** "2025-08" style key. */
  month: string;
  list: ListName;
  subscribes: number;
  unsubscribes: number;
  /** Addresses removed by hygiene (hard bounces, inactive purges). */
  cleaned: number;
  /** Active members at the end of the month. */
  endMembers: number;
}
