/**
 * @class Allows the creation and editing of headings.
 * @base UI.Capability
 * @author Eric Naeseth
 * @constructor
 * @param {UI.Loki}
 */
UI.Heading_Capability = function Headings(loki)
{
	Util.OOP.inherits(this, UI.Capability, loki, 'Headings');
	
	loki.add_event_listener('special_key', function (ev) {
		if (ev.code == ev.ENTER) {
			var b = UI.Special_Key_Handler.get_boundaries(loki);
			var pattern = /^H\d$/;
			
			function is_heading(node)
			{
				return pattern.test(node.tagName);
			}
			
			if (Util.Node.find_match_in_ancestry(b.start.block, is_heading)) {
				// We want a new paragraph, not another heading.
				UI.Special_Key_Handler.insert_block(loki, b, 'P');
				ev.prevent_default();
			}
		}
	}, this);
	
	this.execute = function execute()
	{
		loki.toggle_block('h3');
	}
	
	this.add_menu_items = function add_heading_menu_items(menu)
	{
		var heading_level = loki.query_command_value('FormatBlock');
		
		function toggle(level) {
			loki.toggle_block(level || heading_level);
		}
		
		if (/^h\d$/.test(heading_level)) {
			var group = menu.add_group('Heading');
			
			if (heading_level == 'h3') {
				group.add_item(new UI.Menu.Item('Change to minor heading',
					function switch_to_h4() { toggle('h4'); }));
			} else {
				group.add_item(new UI.Menu.Item('Change to major heading',
					function switch_to_h3() { toggle('h3'); }));
			}
			group.add_item(new UI.Menu.Item('Remove heading',
				function switch_to_p() { toggle('p'); }));
		}
	}
	
	this._determine_illumination = function determine_heading_illumination()
	{
		return /^h\d$/.test(loki.query_command_value('FormatBlock'));
	}
	
	this._add_button('header.gif', 'Heading');
	this._add_keybinding('Ctrl Shift H');
}
