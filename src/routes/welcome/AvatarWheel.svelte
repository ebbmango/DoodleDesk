<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import gsap from 'gsap';
    import Fa from 'svelte-fa';
    import type { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
    
    // Props
    export let icons: Array<{
        id: string;
        icon: IconDefinition;
        label: string;
    }> = [];
    
    export let selectedCategory: string | null = null;
    
    // State
    let wheelContainer: HTMLElement;
    let centralIcon: HTMLElement;
    let currentAngle = 0;
    let currentIndex = 0;
    let isDragging = false;
    let startY = 0;
    let startAngle = 0;
    
    // Constants
    const WHEEL_RADIUS = 120; // Distance from center to icons
    const ICON_SIZE = 50; // Size of each icon circle
    const ROTATION_SNAP = 40; // Degrees per icon
    const VISIBLE_ICONS = 9; // Number of icons visible at once
    
    const dispatch = createEventDispatcher();
    
    $: visibleIcons = icons.length > 0 ? 
        [...icons, ...icons].slice(
            currentIndex, 
            currentIndex + VISIBLE_ICONS
        ) : [];
    
    $: selectedIcon = visibleIcons[Math.floor(VISIBLE_ICONS / 2)];
    
    $: {
        // When selected category changes, update the icon selection
        if (selectedCategory) {
            // Reset/initialize the wheel when category changes
            currentIndex = 0;
            currentAngle = 0;
            updateWheel(0, true);
        }
    }
    
    function getIconPosition(index: number) {
        // Calculate positions in a circle
        // The top position (index 4 for 9 visible icons) should be at the top (270 degrees)
        const middleIndex = Math.floor(VISIBLE_ICONS / 2);
        const angleOffset = (index - middleIndex) * ROTATION_SNAP;
        const angleInRadians = ((270 + angleOffset + currentAngle) * Math.PI) / 180;
        
        return {
            x: Math.cos(angleInRadians) * WHEEL_RADIUS,
            y: Math.sin(angleInRadians) * WHEEL_RADIUS,
            angle: angleOffset + currentAngle
        };
    }
    
    function updateWheel(rotationDelta: number, immediate = false) {
        // Update the current angle
        currentAngle += rotationDelta;
        
        // Calculate the new index based on rotation
        // Each icon is ROTATION_SNAP degrees apart
        const indexDelta = Math.round(rotationDelta / ROTATION_SNAP);
        if (indexDelta !== 0) {
            currentIndex = (currentIndex + indexDelta) % icons.length;
            // Keep currentIndex positive
            if (currentIndex < 0) currentIndex += icons.length;
            
            // Dispatch event when selection changes
            dispatch('select', { 
                selectedIcon: icons[currentIndex],
                index: currentIndex
            });
        }
        
        // Update positions of all visible icons
        visibleIcons.forEach((icon, i) => {
            const iconEl = wheelContainer.querySelector(`[data-icon-id="${icon.id}-${i}"]`) as HTMLElement;
            if (!iconEl) return;
            
            const { x, y, angle } = getIconPosition(i);
            
            // Determine if icon should be visible based on its y position
            const isVisible = y > -WHEEL_RADIUS * 0.5;
            const scale = isVisible ? 1 : 0;
            const opacity = isVisible ? (i === Math.floor(VISIBLE_ICONS / 2) ? 1 : 0.8) : 0;
            
            // Apply rotation and position
            gsap.to(iconEl, {
                x,
                y,
                scale,
                opacity,
                duration: immediate ? 0 : 0.3,
                ease: "power2.out"
            });
            
            // Special treatment for the icon at the top (middle index)
            if (i === Math.floor(VISIBLE_ICONS / 2)) {
                gsap.to(iconEl, {
                    scale: 1.2,
                    duration: immediate ? 0 : 0.3,
                    ease: "power2.out"
                });
                
                // Update central icon
                if (centralIcon) {
                    gsap.to(centralIcon, {
                        opacity: 1,
                        duration: immediate ? 0 : 0.3
                    });
                    
                    // Set the icon in the central circle
                    const centralIconContent = centralIcon.querySelector('.icon-content');
                    if (centralIconContent) {
                        // Update the central icon display
                        gsap.to(centralIconContent, {
                            scale: 1.1,
                            duration: immediate ? 0 : 0.3,
                            ease: "back.out"
                        });
                    }
                }
            }
        });
    }
    
    // Handle wheel rotation via mouse wheel/scroll
    function handleWheel(e: WheelEvent) {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        updateWheel(direction * ROTATION_SNAP);
    }
    
    // Handle wheel rotation via drag
    function handleMouseDown(e: MouseEvent) {
        isDragging = true;
        startY = e.clientY;
        startAngle = currentAngle;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    function handleMouseMove(e: MouseEvent) {
        if (!isDragging) return;
        
        const deltaY = e.clientY - startY;
        const rotationDelta = deltaY * 0.5; // Adjust sensitivity
        
        updateWheel(rotationDelta - (currentAngle - startAngle));
    }
    
    function handleMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        // Snap to nearest icon position
        const snapAngle = Math.round(currentAngle / ROTATION_SNAP) * ROTATION_SNAP;
        gsap.to({}, {
            duration: 0.3,
            onUpdate: function() {
                const progress = this.progress();
                const newAngle = currentAngle + (snapAngle - currentAngle) * progress;
                updateWheel(newAngle - currentAngle);
            }
        });
    }
    
    // Handle touch events for mobile
    function handleTouchStart(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        isDragging = true;
        startY = e.touches[0].clientY;
        startAngle = currentAngle;
    }
    
    function handleTouchMove(e: TouchEvent) {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        
        const deltaY = e.touches[0].clientY - startY;
        const rotationDelta = deltaY * 0.5; // Adjust sensitivity
        
        updateWheel(rotationDelta - (currentAngle - startAngle));
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // Snap to nearest icon position
        const snapAngle = Math.round(currentAngle / ROTATION_SNAP) * ROTATION_SNAP;
        gsap.to({}, {
            duration: 0.3,
            onUpdate: function() {
                const progress = this.progress();
                const newAngle = currentAngle + (snapAngle - currentAngle) * progress;
                updateWheel(newAngle - currentAngle);
            }
        });
    }
    
    // Initialize wheel on mount
    onMount(() => {
        // Initial wheel setup
        updateWheel(0, true);
        
        return () => {
            // Cleanup event listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    });
    
    function selectIcon(icon: typeof icons[number]) {
        dispatch('select', { 
            selectedIcon: icon,
            index: icons.findIndex(i => i.id === icon.id)
        });
    }
</script>

<div class="relative flex items-center justify-center"
    on:wheel={handleWheel}
    on:mousedown={handleMouseDown}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}>
    
    <!-- Central larger icon -->
    <div bind:this={centralIcon} 
        class="bg-festival absolute flex h-32 w-32 items-center justify-center rounded-full">
        <div class="icon-content text-sunblush flex h-full w-full items-center justify-center">
            {#if selectedIcon}
                <Fa icon={selectedIcon.icon} size="3x" />
            {/if}
        </div>
    </div>
    
    <!-- Selected label -->
    {#if selectedIcon}
        <div class="absolute -top-12 bg-sunblush rounded-lg px-3 py-1 text-sm">
            {selectedIcon.label}
        </div>
    {/if}
    
    <!-- Icon wheel -->
    <div bind:this={wheelContainer} class="relative h-64 w-64">
        {#each visibleIcons as icon, i (icon.id + "-" + i)}
            <div 
                data-icon-id={`${icon.id}-${i}`}
                class="bg-festival text-sunblush absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full"
                on:click={() => selectIcon(icon)}>
                <Fa icon={icon.icon} />
            </div>
        {/each}
    </div>
    
    <!-- Bottom dots indicator -->
    <div class="absolute -bottom-8 flex gap-1">
        <span class="text-festival text-lg">•••</span>
    </div>
</div>
