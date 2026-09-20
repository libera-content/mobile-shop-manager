export interface ConfigIssue{readonly file:string;readonly path:string;readonly message:string;}
export class ConfigError extends Error{
 readonly issues:readonly ConfigIssue[];
 constructor(issues:readonly ConfigIssue[]){super(issues.map(i=>`${i.file}:${i.path} ${i.message}`).join('\n'));this.name='ConfigError';this.issues=issues;}
}
