/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const Meta = imports.gi.Meta;

const Manager = global.workspace_manager

class Extension {
    constructor() {
        this.handles = [];
    }

    enable() {
        this.handles.push(
            global.window_manager.connect('destroy', () => {
                try {
                    const ws = Manager.get_active_workspace()
                    // XXX: should probably check it's not the last workspace.
                    if (! ws.list_windows().length)
                        Manager.remove_workspace(ws, 0)
                } catch {
                    // nothing
                }
        }))
    }

    disable() {
        this.handles.forEach(h => global.window_manager.disconnect(h));
    }
}

function init() {
    return new Extension();
}
