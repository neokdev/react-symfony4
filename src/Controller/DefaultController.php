<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

/**
 * Class DefaultController
 */
class DefaultController extends BaseController
{
    /**
     * @Route(
     *     "/",
     *     name="homepage"
     * )
     */
    public function indexAction()
    {
        return $this->redirectToRoute('lift');
    }
}
