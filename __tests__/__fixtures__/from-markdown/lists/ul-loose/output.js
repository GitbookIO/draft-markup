/** @jsx h */
import h from '../../../hyperscript';

export default (
    <document>
        <unordered_list>
            <list_item>
                <paragraph>Item 1</paragraph>
                <code_block>
                    <code_line>Item 1 text</code_line>
                    <code_line>Some other text</code_line>
                </code_block>
            </list_item>
            <list_item>
                <paragraph>Item 2</paragraph>
                <code_block>
                    <code_line>Item 2 text</code_line>
                </code_block>
            </list_item>
        </unordered_list>
    </document>
);
