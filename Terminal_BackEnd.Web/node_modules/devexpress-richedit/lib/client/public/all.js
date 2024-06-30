import * as richEdit from './rich-edit';
import * as events from './events';
import * as options from './options';
const DevExpress = window.DevExpress = window.DevExpress || {};
DevExpress.RichEdit = Object.assign(Object.assign(Object.assign({}, richEdit), events), options);
export * from './rich-edit';
export * from './events';
export * from './options';
