/**
 * Parser Visualizer Application
 * Main frontend JavaScript for handling UI interactions and D3 visualization
 */

class ParserVisualizer {
    constructor() {
        this.currentData = null;
        this.currentZoom = d3.zoomIdentity;
        this.selectedNode = null;
        this.simulation = null;
        this.g = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateLayoutButtons();
        this.loadExamples();
    }

    initializeElements() {
        this.codeEditor = document.getElementById("codeEditor");
        this.parseBtn = document.getElementById("parseBtn");
        this.clearBtn = document.getElementById("clearBtn");
        this.exampleSelect = document.getElementById("exampleSelect");
        this.errorMessage = document.getElementById("errorMessage");
        this.lineCount = document.getElementById("lineCount");
        this.charCount = document.getElementById("charCount");
        this.svg = d3.select("#svg");
        this.tooltip = document.getElementById("tooltip");
        this.nodeDetails = document.getElementById("nodeDetails");
        this.loadingSpinner = document.getElementById("loadingSpinner");
        
        this.zoomInBtn = document.getElementById("zoomInBtn");
        this.zoomOutBtn = document.getElementById("zoomOutBtn");
        this.resetZoomBtn = document.getElementById("resetZoomBtn");
        this.exportBtn = document.getElementById("exportBtn");
        this.forceLayoutBtn = document.getElementById("forceLayoutBtn");
        this.treeLayoutBtn = document.getElementById("treeLayoutBtn");
        this.currentLayout = 'force';
    }

    attachEventListeners() {
        this.parseBtn.addEventListener("click", () => this.parseCode());
        this.clearBtn.addEventListener("click", () => this.clearCode());
        this.exampleSelect.addEventListener("change", (e) => this.loadExample(e.target.value));
        
        this.codeEditor.addEventListener("input", () => this.updateStats());
        
        if (this.zoomInBtn) this.zoomInBtn.addEventListener("click", () => this.zoom(1.2));
        if (this.zoomOutBtn) this.zoomOutBtn.addEventListener("click", () => this.zoom(0.8));
        if (this.resetZoomBtn) this.resetZoomBtn.addEventListener("click", () => this.resetZoom());
        if (this.exportBtn) this.exportBtn.addEventListener("click", () => this.exportJSON());

        if (this.forceLayoutBtn) {
            this.forceLayoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.debug('Force layout button clicked');
                this.currentLayout = 'force';
                this.updateLayoutButtons();
                if (this.currentData && this.currentData.flattened) {
                    this.visualizeTree(this.currentData.flattened);
                } else {
                    console.warn('No data available to visualize');
                }
            });
        } else {
            console.warn('forceLayoutBtn not found in DOM');
        }

        if (this.treeLayoutBtn) {
            this.treeLayoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.debug('Tree layout button clicked');
                this.currentLayout = 'tree';
                this.updateLayoutButtons();
                if (this.currentData && this.currentData.flattened) {
                    this.visualizeTree(this.currentData.flattened);
                } else {
                    console.warn('No data available to visualize');
                }
            });
        } else {
            console.warn('treeLayoutBtn not found in DOM');
        }
        
        // Keyboard shortcut for parsing (Ctrl+Enter)
        this.codeEditor.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                this.parseCode();
            }
        });
    }

    async loadExamples() {
        try {
            const response = await fetch("/api/examples");
            const examples = await response.json();
            this.examples = examples;
        } catch (error) {
            console.error("Failed to load examples:", error);
        }
    }

    async loadExample(name) {
        if (name && this.examples && this.examples[name]) {
            this.codeEditor.value = this.examples[name];
            this.updateStats();
            this.exampleSelect.value = "";
        }
    }

    updateStats() {
        const code = this.codeEditor.value;
        this.lineCount.textContent = `Lines: ${code.split("\n").length}`;
        this.charCount.textContent = `Chars: ${code.length}`;
    }

    clearCode() {
        this.codeEditor.value = "";
        this.clearVisualization();
        this.clearError();
        this.updateStats();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add("show");
    }

    clearError() {
        this.errorMessage.textContent = "";
        this.errorMessage.classList.remove("show");
    }

    showLoading(show = true) {
        this.loadingSpinner.style.display = show ? "flex" : "none";
    }

    async parseCode() {
        const code = this.codeEditor.value.trim();
        
        if (!code) {
            this.showError("Please enter some code to parse");
            return;
        }

        this.clearError();
        this.showLoading(true);
        this.clearVisualization();

        try {
            const response = await fetch("/api/parse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code,
                    language: "python",
                }),
            });

            const data = await response.json();

            if (!data.success) {
                this.showError(data.error || "Failed to parse code");
                this.showLoading(false);
                return;
            }

            this.currentData = data;
            this.visualizeTree(data.flattened);
            this.showLoading(false);
        } catch (error) {
            this.showError(`Error: ${error.message}`);
            this.showLoading(false);
        }
    }

    clearVisualization() {
        if (this.svg && this.svg.node()) {
            this.svg.selectAll("*").remove();
        }
        this.nodeDetails.innerHTML = '<p class="placeholder">Click on a node to view details</p>';
        this.selectedNode = null;
        this.g = null;
        this.zoomBehavior = null;
        this.simulation = null;
    }

    visualizeTree(data) {
        if (!data || !data.nodes || data.nodes.length === 0) {
            this.showError("No nodes to visualize");
            return;
        }
        this.clearVisualization();

        if (this.currentLayout === 'force') {
            console.debug('Visualizing with force layout');
            this._visualizeForce(data);
        } else {
            // prefer hierarchical layout when available
            if (!data.hierarchy) {
                console.warn('Hierarchy data not available, falling back to force layout');
                this.currentLayout = 'force';
                this.updateLayoutButtons();
                this._visualizeForce(data);
                return;
            }
            console.debug('Visualizing with tree layout');
            this._visualizeTree(data.hierarchy);
        }
        this.updateLayoutButtons();
    }

    updateLayoutButtons() {
        if (this.forceLayoutBtn) {
            if (this.currentLayout === 'force') {
                this.forceLayoutBtn.classList.add('primary');
            } else {
                this.forceLayoutBtn.classList.remove('primary');
            }
        }
        if (this.treeLayoutBtn) {
            if (this.currentLayout === 'tree') {
                this.treeLayoutBtn.classList.add('primary');
            } else {
                this.treeLayoutBtn.classList.remove('primary');
            }
        }
    }

    _visualizeForce(data) {
        const width = document.getElementById("visualizationContainer").clientWidth;
        const height = document.getElementById("visualizationContainer").clientHeight;

        // Create SVG elements
        this.svg = d3.select("#svg");
        this.svg.attr('width', width).attr('height', height);

        // Main group for transformations
        this.g = this.svg.append("g");

        // Add zoom behavior and attach to SVG
        this._attachZoom();

        // Create a force simulation
        this.simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links)
                .id(d => d.id)
                .distance(100))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(24));

        // Draw links
        const link = this.g.selectAll(".link")
            .data(data.links)
            .enter()
            .append("line")
            .attr("class", "link");

        // Draw nodes
        const node = this.g.selectAll(".node")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(this.drag(this.simulation));

        node.append("circle")
            .attr("r", 10)
            .on("mouseover", (event, d) => this.showTooltip(event, d))
            .on("mouseout", () => this.hideTooltip())
            .on("click", (event, d) => this.selectNode(event, d));

        node.append("text")
            .text(d => (d.name || '').substring(0, 8))
            .attr('dy', -16)
            .on("click", (event, d) => this.selectNode(event, d));

        // Update positions on each simulation tick
        this.simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });

        // Initial zoom fit - wait for first tick to ensure positions are set
        this.simulation.on("end", () => this.fitZoom());
        // Also fit on a timer in case simulation doesn't settle
        setTimeout(() => this.fitZoom(), 1000);
    }

    _visualizeTree(hierarchy) {
        const width = document.getElementById("visualizationContainer").clientWidth;
        const height = document.getElementById("visualizationContainer").clientHeight;

        this.svg = d3.select("#svg");
        this.svg.attr('width', width).attr('height', height);

        // clear and create group with margin
        this.g = this.svg.append('g');

        // Attach zoom to svg (updates this.g transform)
        this._attachZoom();

        const margin = { top: 60, right: 40, bottom: 40, left: 40 };
        const innerWidth = Math.max(200, width - margin.left - margin.right);
        const innerHeight = Math.max(200, height - margin.top - margin.bottom);

        const root = d3.hierarchy(hierarchy, d => d.children);
        // For vertical (top-down) tree: size([width, height]) spreads horizontally then vertically
        const treeLayout = d3.tree().size([innerWidth, innerHeight]);
        treeLayout(root);

        // Draw links (vertical curved links from parent to child)
        const link = this.g.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('d', d => {
                const x0 = d.source.x + margin.left;
                const y0 = d.source.y + margin.top;
                const x1 = d.target.x + margin.left;
                const y1 = d.target.y + margin.top;
                // Cubic Bézier curve: control points pulled vertically
                return `M${x0},${y0}C${x0},${(y0 + y1) / 2} ${x1},${(y0 + y1) / 2} ${x1},${y1}`;
            });

        // Draw nodes
        const node = this.g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x + margin.left},${d.y + margin.top})`)
            .on('click', (event, d) => this.selectNode(event, d.data))
            .on('mouseover', (event, d) => this.showTooltip(event, d.data))
            .on('mouseout', () => this.hideTooltip());

        node.append('circle')
            .attr('r', 10)
            .attr('fill', d => d.depth === 0 ? '#10b981' : '#3b82f6');

        node.append('text')
            .attr('class', 'nodelabel')
            .attr('x', 14)
            .attr('y', 4)
            .text(d => (d.data.name || '').length > 30 ? (d.data.name || '').substring(0, 28) + '…' : d.data.name || '');

        // Center the tree: position root at top-center and fit the whole tree
        setTimeout(() => {
            const bounds = this.g.node().getBBox();
            const containerWidth = width;
            const containerHeight = height;
            
            // Calculate scale to fit tree with some padding
            const scale = Math.min(1.0, 0.85 / Math.max(bounds.width / containerWidth, bounds.height / containerHeight));
            
            // Center horizontally and position near top
            const midX = bounds.x + bounds.width / 2;
            const midY = bounds.y + bounds.height / 2;
            const translateX = containerWidth / 2 - scale * midX;
            const translateY = 60 - scale * bounds.y; // Keep some top padding
            
            const t = d3.zoomIdentity.translate(translateX, translateY).scale(scale);
            if (this.svg && this.zoomBehavior) {
                this.svg.transition().duration(500).call(this.zoomBehavior.transform, t);
                this.currentZoom = t;
            }
        }, 50);
    }

    _attachZoom() {
        // remove previous zoom listeners if any
        try {
            if (this.zoomBehavior && this.svg) {
                // nothing to remove cleanly; overwrite
            }
        } catch (e) {}

        const self = this;
        this.zoomBehavior = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', function(event) {
                if (self.g) self.g.attr('transform', event.transform);
                self.currentZoom = event.transform;
            });

        this.svg.call(this.zoomBehavior);
        // initialize currentZoom
        this.currentZoom = d3.zoomIdentity;
    }

    drag(simulation) {
        let x;
        let y;

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            x = event.x;
            y = event.y;
        }

        function dragged(event) {
            event.subject.x += event.x - x;
            event.subject.y += event.y - y;
            x = event.x;
            y = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    showTooltip(event, d) {
        this.tooltip.textContent = d.name;
        this.tooltip.classList.add("show");
        this.updateTooltipPosition(event);
    }

    updateTooltipPosition(event) {
        this.tooltip.style.left = (event.pageX + 10) + "px";
        this.tooltip.style.top = (event.pageY + 10) + "px";
    }

    hideTooltip() {
        this.tooltip.classList.remove("show");
    }

    selectNode(event, d) {
        event.stopPropagation();
        
        // Remove previous selection
        if (this.selectedNode) {
            d3.selectAll(".node").classed("selected", false);
        }

        this.selectedNode = d;
        d3.select(event.target.parentNode).classed("selected", true);
        this.showNodeDetails(d);
    }

    showNodeDetails(node) {
        let html = `<div class="node-details-content">`;
        html += `<div class="detail-item"><span class="detail-label">Node Type:</span> <span class="detail-value">${node.name}</span></div>`;
        html += `<div class="detail-item"><span class="detail-label">Node ID:</span> <span class="detail-value">${node.id}</span></div>`;

        if (node.attributes && Object.keys(node.attributes).length > 0) {
            html += `<div class="detail-item"><span class="detail-label">Attributes:</span></div>`;
            for (const [key, value] of Object.entries(node.attributes)) {
                html += `<div class="detail-item" style="margin-left: 16px;"><span class="detail-value">${key}: ${JSON.stringify(value)}</span></div>`;
            }
        }

        html += `</div>`;
        this.nodeDetails.innerHTML = html;
    }

    zoom(factor) {
        if (!this.zoomBehavior || !this.svg) return;
        const newTransform = d3.zoomIdentity.translate(this.currentZoom.x, this.currentZoom.y).scale(this.currentZoom.k * factor);
        this.svg.transition().duration(300).call(this.zoomBehavior.transform, newTransform);
    }

    resetZoom() {
        if (!this.zoomBehavior || !this.svg) return;
        this.svg.transition().duration(300).call(this.zoomBehavior.transform, d3.zoomIdentity);
        this.currentZoom = d3.zoomIdentity;
    }

    fitZoom() {
        if (!this.g || !this.svg || !this.zoomBehavior) return;
        const container = document.getElementById("visualizationContainer");
        const bounds = this.g.node().getBBox();
        const fullWidth = container.clientWidth;
        const fullHeight = container.clientHeight;
        const midX = bounds.x + bounds.width / 2;
        const midY = bounds.y + bounds.height / 2;

        if (bounds.width > 0 && bounds.height > 0) {
            const scale = Math.min(1.2, 0.9 / Math.max(bounds.width / fullWidth, bounds.height / fullHeight));
            const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

            const t = d3.zoomIdentity.translate(...translate).scale(scale);
            this.svg.transition().duration(750).call(this.zoomBehavior.transform, t);
            this.currentZoom = t;
        }
    }

    exportJSON() {
        if (!this.currentData) {
            this.showError("No parsed data to export");
            return;
        }

        const dataStr = JSON.stringify(this.currentData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ast-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the visualizer when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new ParserVisualizer();
});
