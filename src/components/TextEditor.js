import React from 'react';
import PropTypes from 'prop-types';

import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertToRaw, 
  convertFromRaw, 
} from 'draft-js';

// Custom overrides for 'code' style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: "'Inconsolata', 'Menlo', 'Consolas', 'monospace'",
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': 
      return 'RichEditor-blockquote';
    default: 
      return null;
  }
}

class StyleButton extends React.Component {
  onToggle = event => {
    const { onToggle, style } = this.props;
    event.preventDefault();
    onToggle(style);
  };

  render() {
    let className = 'RichEditor-styleButton';
    const { label, active } = this.props;

    if (active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className='RichEditor-controls'>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className='RichEditor-controls'>
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

class TextEditor extends React.PureComponent {
  state = {
    editorState: EditorState.createEmpty(),
  };

  focus = _ => {
    this.refs.editor.focus();
  };

  handleChange = editorState => {
    this.setState({ editorState });
  };

  handleBlur = _ => {
    // Convert editorState to string before sending it through onChange()
    const { onChange, name } = this.props;
    const { editorState } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    const value = JSON.stringify(raw);

    onChange({ target: { name, value } });
  };

  handleKeyCommand = command => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleChange(newState);
      return true;
    }
    return false;
  };

  onTab = event => {
    const maxDepth = 4;
    this.handleChange(RichUtils.onTab(event, this.state.editorState, maxDepth));
  };

  toggleBlockType= blockType => {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  };

  toggleInlineStyle = inlineStyle => {
    this.handleChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  };

  initialState = _ => {
    try {
      const derivedValue = JSON.parse(this.props.value);
      this.setState({ 
        editorState: EditorState.createWithContent(
          convertFromRaw(derivedValue)
        )
      });
    } catch(syntaxError) {
      console.error('You should check the text of this TextEditor, as it has an error below.');
      console.error(syntaxError);
    }
  };

  componentDidMount() {
    if (this.props.value) {
      this.initialState();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && this.props.value !== prevProps.value) {
      this.initialState();
    }
  }

  render() {
    const { editorState } = this.state;
    const { required, error, helperText, placeholder, label } = this.props;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    let rootClassName = 'RichEditor-root';
    let labelClassName = 'label';
    let helperTextClassName = 'RichEditor-helper-text';
    const contentState = editorState.getCurrentContent();

    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    if (error) {
      rootClassName += ' error';
      helperTextClassName += ' error';
      labelClassName += ' error';
    }

    return (
      <React.Fragment>
        <div className={rootClassName}>
          <div className={labelClassName}>
            {label}
            {required && <span> *</span>}
          </div>
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              onTab={this.onTab}
              placeholder={placeholder}
              ref='editor'
              spellCheck={true}
            />
          </div>
        </div>

        {helperText && (
          <p className={helperTextClassName}>
            {helperText}
          </p>
        )}
      </React.Fragment>
    );
  }
}

TextEditor.propTypes = {
  error: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  helperText: PropTypes.string,
  onChange: PropTypes.func,
};

TextEditor.defaultProps = {
  value: '',
  placeholder: '',
  onChange() {},
};

export default TextEditor;