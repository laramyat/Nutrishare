<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AdminMiddleware;

return Application::configure(basePath: dirname(__DIR__))

    ->withRouting(
        api: dirname(__DIR__) . '/routes/api.php',
        web: dirname(__DIR__) . '/routes/web.php',
        commands: dirname(__DIR__) . '/routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {

        // Register custom middleware aliases
        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);

    })

    ->withExceptions(function (Exceptions $exceptions) {
        //
    })

    ->create();
