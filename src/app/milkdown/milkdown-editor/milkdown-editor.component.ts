import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';

// Milkdown
import { Ctx, editorViewCtx, parserCtx, Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
// Plugins
import { clipboard } from '@milkdown/plugin-clipboard';
import { cursor } from '@milkdown/plugin-cursor';
import { emoji } from '@milkdown/plugin-emoji';
import { history } from '@milkdown/plugin-history';
import { Listener, listener, listenerCtx } from '@milkdown/plugin-listener';
import { math } from '@milkdown/plugin-math';
import { prism } from '@milkdown/plugin-prism';
import { slash } from '@milkdown/plugin-slash';
import { tooltip } from '@milkdown/plugin-tooltip';
import { diagram } from '@milkdown/plugin-diagram';
import { gfm } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';
import { Slice } from 'prosemirror-model';

@Component({
  selector: 'app-milkdown-editor',
  templateUrl: './milkdown-editor.component.html',
  styleUrls: ['./milkdown-editor.component.scss']
})
export class MilkdownEditorComponent implements AfterViewInit {
  public id = new Date().getTime() * Math.random();
  public uniqueId = `milkdown-editor-${this.id.toString().replace('.', '')}`;

  public editor: Editor;
  public context: Ctx;

  @Output()
  public change = new EventEmitter<string>();

  constructor() {}

  public async ngAfterViewInit(): Promise<void> {
    const listenerDt = {
      markdown: [
        (getMarkdown) => {
          let currentMarkdown: string = getMarkdown();

          this.change.emit(currentMarkdown);
        }
      ]
    };

    this.editor = await Editor.make()
      .config((ctx: Ctx) => {
        ctx.set(rootCtx, document.querySelector(`#${this.uniqueId}`));
        ctx.set(listenerCtx, listenerDt as any);

        this.context = ctx;
      })
      .use(tooltip)
      .use(nord)
      .use(gfm)
      .use(clipboard)
      .use(cursor)
      .use(math)
      .use(prism)
      .use(emoji)
      .use(slash)
      .use(history)
      .use(listener)
      .use(diagram)
      .create();
  }

  public setContent(content): void {
    // this.context.set(defaultValueCtx, content);

    this.context.set(defaultValueCtx, content);
    this.editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const parser = ctx.get(parserCtx);
      const doc = parser(content);

      if (!doc) return;

      const state = view.state;
      view.dispatch(state.tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0)));
    });
  }
}
