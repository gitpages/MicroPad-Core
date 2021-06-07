import * as React from 'react';
import { Button, Icon, Modal, TextInput } from 'react-materialize';
import { Dialog } from '../../services/dialogs';
import { NoteElement, Source } from 'upad-parse/dist/Note';
import { Note } from 'upad-parse/dist';
import { DEFAULT_MODAL_OPTIONS } from '../../util';

export interface ISourcesComponent {
	element: NoteElement;
	note: Note;
	updateBibliography?: (bibliography: Source[]) => void;
}

export default class SourcesComponent extends React.Component<ISourcesComponent> {
	render() {
		const { note, element } = this.props;
		const bibliography = note.bibliography.filter(source => source.item === element.args.id);

		const sources: JSX.Element[] = [];
		bibliography.forEach(source => sources.push(
			<div key={`${note.title}-source-${source.id}`}>
				<a href={source.content} rel="noopener noreferrer" target="_blank">Open URL</a><br />
				<TextInput type="url" value={source.content} label="URL" onChange={e => this.onSourceEdit(source.id, e.target.value)} />
			</div>
		));

		return (
			<Modal
				header="Bibliography"
				trigger={<a href="#!" style={{ display: 'inline-flex', verticalAlign: 'middle' }}><Icon>school</Icon> <span style={{ marginLeft: '5px' }}>Bibliography ({bibliography.length})</span></a>}
				options={DEFAULT_MODAL_OPTIONS}>
				<Button className="blue" waves="light" onClick={this.addSource}><Icon left={true}>add</Icon> Add Source</Button>
				<br /><br />

				{sources}
			</Modal>
		);
	}

	private onSourceEdit = (id: number, value: string) => {
		const { updateBibliography, note } = this.props;

		if (value.length === 0) {
			// Delete source
			updateBibliography!(note.bibliography.filter(source => source.id !== id));
			return;
		}

		updateBibliography!(
			note.bibliography
				.map(source =>
					(source.id !== id)
					? source
					: { ...source, content: value }
				)
		);
	}

	private addSource = async () => {
		const { updateBibliography, element, note } = this.props;

		const url = await Dialog.prompt('Source URL:');
		if (!url || url.length === 0) return;

		updateBibliography!([
			...note.bibliography,
			{
				id: note.bibliography.length + 1,
				item: element.args.id,
				content: url
			}
		]);
	}
}
