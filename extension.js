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

class Extension {
    constructor() {
        this.handles = [];
        this.workspaces = new Set();

        //this.update_watched_workspaces()
    }

    check_current_workspace() {
        const id = global.workspace_manager.get_active_workspace_index();
        this.check_workspace(id)
    }

    check_workspace(id) {
        try {
            // XXX: passing the workspace breaks everything, so we pass ids...
            const ws = global.workspace_manager.get_workspace_by_index(id);
            // XXX: should probably check it's not the last workspace.
            if (! ws.list_windows().length) {
                this.workspaces.delete(ws.toString());
                global.workspace_manager.remove_workspace(ws, 0);
            }
        } catch {
            // nothing
        }
    }

    workspaces_forEach(fn) {
        for (let i = 0; i < global.workspace_manager.get_n_workspaces(); i++) {
            try {
                const ws = global.workspace_manager.get_workspace_by_index(i);
                fn(ws, i);
            } catch {
                // nothing
            }

        }
    }

    find_workspace_index(ws) {
        let index = -1;
        this.workspaces_forEach((w, i) => {
            if (w === ws)
                index = i;
        })

        return index;
    }

    update_watched_workspaces() {
        this.workspaces_forEach((ws, i) => {
            const wss = ws.toString();
            if (! this.workspaces.has(wss)) {
                this.workspaces.add(wss)
                ws.connect('window-removed',
                           () => this.check_workspace(
                               this.find_workspace_index(ws)));
            }
        })
    }

    enable() {
        this.handles.push(
            global.window_manager.connect(
                'destroy',
                () => this.check_current_workspace()))
        this.handles.push(
            global.workspace_manager.connect(
                'workspace-added',
                () => this.update_watched_workspaces())) 
    }

    disable() {
        this.handles.forEach(h => global.window_manager.disconnect(h));
    }
}

function init() {
    return new Extension();
}
