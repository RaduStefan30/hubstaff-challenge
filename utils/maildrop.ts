import { APIRequestContext, expect } from '@playwright/test';

export class MaildropHelper {
    constructor(private request: APIRequestContext) { }

    static randomMailbox(): { mailbox: string; email: string } {
        const mailbox = `test${Date.now()}`;
        return { mailbox, email: `${mailbox}@maildrop.cc` };
    }

    async getInbox(mailbox: string) {
        const query = {
            query: `query ($box:String!){ inbox(mailbox:$box){ id subject date } }`,
            variables: { box: mailbox }
        };
        const res = await this.request.post('https://api.maildrop.cc/graphql', {
            data: query,
            headers: { 'content-type': 'application/json' }
        });
        expect(res.ok()).toBeTruthy();
        return (await res.json()).data.inbox as { id: string; subject: string }[];
    }

    async readMessage(mailbox: string, id: string) {
        const query = {
            query: `query($box:String!,$id:String!){ message(mailbox:$box,id:$id){ html data } }`,
            variables: { box: mailbox, id }
        };
        const res = await this.request.post('https://api.maildrop.cc/graphql', {
            data: query,
            headers: { 'content-type': 'application/json' }
        });
        expect(res.ok()).toBeTruthy();
        return (await res.json()).data.message as { html: string; data: string };
    }
}
